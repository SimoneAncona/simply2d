#pragma once
#include <SDL.h>
#include <SDL_mixer.h>
#include <array>
#include <memory>
#include <map>
#include <string>
#include "common.hh"

namespace SDLAudio
{
	using Chunk = std::shared_ptr<Mix_Chunk>;
	using Music = std::shared_ptr<Mix_Music>;
	struct Voice
	{
		Chunk chunk;
		int id = 0;
		bool paused = false;
		float volume = 1;
	};
	struct Engine;
	Engine *owner = nullptr;
	struct Engine
	{
		bool closed = false, paused = false, musicPaused = false;
		float volume = 1, musicVolume = 1;
		int nextID = 0, musicID = 0;
		std::array<Voice, 32> voices{};
		std::map<std::string, Chunk> sounds;
		std::map<std::string, Music> music;
		Music currentMusic;
		int token()
		{
			nextID = nextID == 2147483647 ? 1 : nextID + 1;
			return nextID;
		}
		void volumes()
		{
			for (int i = 0; i < 32; ++i)
				Mix_Volume(i, static_cast<int>(voices[i].volume * volume * MIX_MAX_VOLUME));
			Mix_VolumeMusic(static_cast<int>(musicVolume * volume * MIX_MAX_VOLUME));
		}
		void close()
		{
			if (closed)
				return;
			closed = true;
			Mix_HaltChannel(-1);
			Mix_HaltMusic();
			for (auto &voice : voices)
				voice = Voice{};
			currentMusic.reset();
			sounds.clear();
			music.clear();
			Mix_CloseAudio();
			Mix_Quit();
			SDL_QuitSubSystem(SDL_INIT_AUDIO);
			owner = nullptr;
		}
		~Engine()
		{
			if (owner == this)
				close();
		}
	};
	Engine *get(const Napi::CallbackInfo &info)
	{
		auto engine = info[0].As<Napi::External<Engine>>().Data();
		if (engine->closed)
		{
			Napi::Error::New(info.Env(), "The audio device is closed").ThrowAsJavaScriptException();
			return nullptr;
		}
		return engine;
	}
	Napi::Value open(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		if (owner)
		{
			Napi::Error::New(env, "SDL_mixer supports one Audio instance at a time").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		if (SDL_InitSubSystem(SDL_INIT_AUDIO) != 0)
		{
			Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		const int codecs = MIX_INIT_FLAC | MIX_INIT_MP3 | MIX_INIT_OGG;
		if ((Mix_Init(codecs) & codecs) != codecs || Mix_OpenAudio(48000, AUDIO_S16SYS, 2, 512) != 0)
		{
			std::string error = Mix_GetError();
			Mix_Quit();
			SDL_QuitSubSystem(SDL_INIT_AUDIO);
			Napi::Error::New(env, error).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		Mix_AllocateChannels(32);
		owner = new Engine();
		owner->volumes();
		return Napi::External<Engine>::New(env, owner,
		                                   [](Napi::Env, Engine *value)
		                                   {
			                                   delete value;
		                                   });
	}
	Napi::Value close(const Napi::CallbackInfo &info)
	{
		info[0].As<Napi::External<Engine>>().Data()->close();
		return info.Env().Undefined();
	}
	Napi::Value load(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = get(info);
		if (!engine)
			return env.Undefined();
		SDL_RWops *input = nullptr;
		if (info[2].IsString())
			input = SDL_RWFromFile(info[2].As<Napi::String>().Utf8Value().c_str(), "rb");
		else
		{
			auto data = info[2].As<Napi::Uint8Array>();
			if (data.ByteLength() > 2147483647)
			{
				Napi::RangeError::New(env, "Sound buffer is too large").ThrowAsJavaScriptException();
				return env.Undefined();
			}
			input = SDL_RWFromConstMem(data.Data(), static_cast<int>(data.ByteLength()));
		}
		Mix_Chunk *chunk = input ? Mix_LoadWAV_RW(input, 1) : nullptr;
		if (!chunk)
		{
			Napi::Error::New(env, std::string("Cannot load sound: ") + Mix_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		Chunk loaded(chunk, Mix_FreeChunk);
		if (!chunk->alen)
		{
			Napi::Error::New(env, "Sound is empty").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		engine->sounds.insert_or_assign(info[1].As<Napi::String>().Utf8Value(), loaded);
		return Napi::Number::New(env, chunk->alen / (48000.0 * 4));
	}
	Napi::Value play(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = get(info);
		if (!engine)
			return env.Undefined();
		auto sound = engine->sounds.find(info[1].As<Napi::String>().Utf8Value());
		if (sound == engine->sounds.end())
		{
			Napi::Error::New(env, "Sound is not loaded").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		for (int i = 0; i < 32; ++i)
		{
			if (Mix_Playing(i))
				continue;
			auto &voice = engine->voices[i];
			// Explicit channels and generation IDs keep old playback handles from controlling reused channels.
			voice = Voice{sound->second, engine->token(), false, info[3].As<Napi::Number>().FloatValue()};
			Mix_Volume(i, static_cast<int>(voice.volume * engine->volume * MIX_MAX_VOLUME));
			if (Mix_PlayChannel(i, voice.chunk.get(), info[2].As<Napi::Boolean>().Value() ? -1 : 0) < 0)
			{
				voice = Voice{};
				Napi::Error::New(env, Mix_GetError()).ThrowAsJavaScriptException();
				return env.Undefined();
			}
			if (engine->paused)
				Mix_Pause(i);
			return Napi::Number::New(env, voice.id);
		}
		Napi::Error::New(env, "All 32 audio voices are in use").ThrowAsJavaScriptException();
		return env.Undefined();
	}
	Napi::Value music_load(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = get(info);
		if (!engine)
			return env.Undefined();
		Music music(Mix_LoadMUS(info[2].As<Napi::String>().Utf8Value().c_str()), Mix_FreeMusic);
		if (!music)
		{
			Napi::Error::New(env, Mix_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		engine->music.insert_or_assign(info[1].As<Napi::String>().Utf8Value(), music);
		return env.Undefined();
	}
	Napi::Value music_play(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = get(info);
		if (!engine)
			return env.Undefined();
		auto music = engine->music.find(info[1].As<Napi::String>().Utf8Value());
		if (music == engine->music.end())
		{
			Napi::Error::New(env, "Music is not loaded").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		Mix_HaltMusic();
		engine->currentMusic.reset();
		engine->musicID = 0;
		engine->musicVolume = info[3].As<Napi::Number>().FloatValue();
		engine->volumes();
		if (Mix_PlayMusic(music->second.get(), info[2].As<Napi::Boolean>().Value() ? -1 : 0) != 0)
		{
			Napi::Error::New(env, Mix_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		engine->musicPaused = false;
		if (engine->paused)
			Mix_PauseMusic();
		engine->currentMusic = music->second;
		engine->musicID = -engine->token();
		return Napi::Number::New(env, engine->musicID);
	}
	Napi::Value control(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = get(info);
		if (!engine)
			return env.Undefined();
		int id = info[1].As<Napi::Number>().Int32Value();
		auto action = info[2].As<Napi::String>().Utf8Value();
		if (id < 0 && id == engine->musicID && Mix_PlayingMusic())
		{
			if (action == "state")
				return Napi::String::New(env, engine->paused || Mix_PausedMusic() ? "paused" : "playing");
			if (action == "pause")
			{
				engine->musicPaused = true;
				Mix_PauseMusic();
			}
			else if (action == "resume")
			{
				engine->musicPaused = false;
				if (!engine->paused)
					Mix_ResumeMusic();
			}
			else if (action == "stop")
			{
				Mix_HaltMusic();
				engine->currentMusic.reset();
			}
			else if (action == "volume")
			{
				engine->musicVolume = info[3].As<Napi::Number>().FloatValue();
				engine->volumes();
			}
			return env.Undefined();
		}
		for (int i = 0; i < 32; ++i)
		{
			auto &voice = engine->voices[i];
			if (voice.id != id || !Mix_Playing(i))
				continue;
			if (action == "state")
				return Napi::String::New(env, engine->paused || Mix_Paused(i) ? "paused" : "playing");
			if (action == "pause")
			{
				voice.paused = true;
				Mix_Pause(i);
			}
			else if (action == "resume")
			{
				voice.paused = false;
				if (!engine->paused)
					Mix_Resume(i);
			}
			else if (action == "stop")
			{
				Mix_HaltChannel(i);
				voice = Voice{};
			}
			else if (action == "volume")
			{
				voice.volume = info[3].As<Napi::Number>().FloatValue();
				engine->volumes();
			}
			return env.Undefined();
		}
		if (action == "state")
			return Napi::String::New(env, "stopped");
		return env.Undefined();
	}
	Napi::Value global(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = get(info);
		if (!engine)
			return env.Undefined();
		auto action = info[1].As<Napi::String>().Utf8Value();
		if (action == "volume")
		{
			engine->volume = info[2].As<Napi::Number>().FloatValue();
			engine->volumes();
		}
		else if (action == "pause")
		{
			engine->paused = true;
			Mix_Pause(-1);
			Mix_PauseMusic();
		}
		else if (action == "resume")
		{
			engine->paused = false;
			for (int i = 0; i < 32; ++i)
				if (!engine->voices[i].paused)
					Mix_Resume(i);
			if (!engine->musicPaused)
				Mix_ResumeMusic();
		}
		else if (action == "stop")
		{
			Mix_HaltChannel(-1);
			Mix_HaltMusic();
			engine->currentMusic.reset();
			for (auto &voice : engine->voices)
				voice = Voice{};
		}
		else if (action == "unload")
		{
			auto sound = engine->sounds.find(info[2].As<Napi::String>().Utf8Value());
			if (sound != engine->sounds.end())
			{
				for (int i = 0; i < 32; ++i)
					if (engine->voices[i].chunk == sound->second)
					{
						Mix_HaltChannel(i);
						engine->voices[i] = Voice{};
					}
				engine->sounds.erase(sound);
			}
		}
		else if (action == "unloadMusic")
		{
			auto music = engine->music.find(info[2].As<Napi::String>().Utf8Value());
			if (music != engine->music.end())
			{
				if (music->second == engine->currentMusic)
				{
					Mix_HaltMusic();
					engine->currentMusic.reset();
				}
				engine->music.erase(music);
			}
		}
		return env.Undefined();
	}
}
