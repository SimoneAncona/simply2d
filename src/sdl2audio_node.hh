#pragma once
#include <SDL.h>
#include <array>
#include <memory>
#include <map>
#include <vector>
#include <cmath>
#include <limits>
#include "common.hh"

namespace SDLAudio
{
	using Samples = std::shared_ptr<std::vector<float>>;

	struct Voice
	{
		Samples samples;
		size_t position = 0;
		uint32_t id = 0;
		bool active = false, paused = false, loop = false;
		float volume = 1;
	};

	struct Engine
	{
		SDL_AudioDeviceID device = 0;
		SDL_AudioSpec spec{};
		std::map<std::string, Samples> sounds;
		std::array<Voice, 32> voices{};
		uint32_t nextID = 0;
		float volume = 1;
		bool paused = false;
		static void callback(void *context, Uint8 *stream, int bytes)
		{
			auto &engine = *static_cast<Engine *>(context);
			SDL_memset(stream, 0, bytes);
			if (engine.paused)
				return;
			auto output = reinterpret_cast<float *>(stream);
			const size_t count = bytes / sizeof(float);
			for (auto &voice : engine.voices)
			{
				if (!voice.active || voice.paused)
					continue;
				for (size_t i = 0; i < count; ++i)
				{
					output[i] += (*voice.samples)[voice.position++] * voice.volume * engine.volume;
					if (voice.position == voice.samples->size())
					{
						if (voice.loop)
							voice.position = 0;
						else
						{
							voice.active = false;
							break;
						}
					}
				}
			}
			for (size_t i = 0; i < count; ++i)
				output[i] = std::max(-1.0f, std::min(1.0f, output[i]));
		}

		void close()
		{
			if (!device)
				return;
			SDL_CloseAudioDevice(device); // waits for the callback before releasing samples
			device = 0;
			sounds.clear();
			for (auto &voice : voices)
				voice = Voice{};
			SDL_QuitSubSystem(SDL_INIT_AUDIO);
		}

		~Engine()
		{
			close();
		}
	};

	struct Lock
	{
		SDL_AudioDeviceID device;
		explicit Lock(Engine &engine) : device(engine.device)
		{
			SDL_LockAudioDevice(device);
		}
		~Lock()
		{
			SDL_UnlockAudioDevice(device);
		}
	};

	Engine *get(const Napi::CallbackInfo &info)
	{
		auto engine = info[0].As<Napi::External<Engine>>().Data();
		if (!engine->device)
		{
			Napi::Error::New(info.Env(), "The audio device is closed").ThrowAsJavaScriptException();
			return nullptr;
		}
		return engine;
	}

	Napi::Value open(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = std::make_unique<Engine>();
		if (SDL_InitSubSystem(SDL_INIT_AUDIO) != 0)
		{
			Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		SDL_AudioSpec desired{};
		desired.freq = 48000;
		desired.format = AUDIO_F32SYS;
		desired.channels = 2;
		desired.samples = 512;
		desired.callback = Engine::callback;
		desired.userdata = engine.get();
		engine->device = SDL_OpenAudioDevice(nullptr, 0, &desired, &engine->spec, 0);
		if (!engine->device)
		{
			std::string error = SDL_GetError();
			SDL_QuitSubSystem(SDL_INIT_AUDIO);
			Napi::Error::New(env, error).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		SDL_PauseAudioDevice(engine->device, 0);
		return Napi::External<Engine>::New(env, engine.release(),
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
		SDL_AudioSpec source{};
		Uint8 *data = nullptr;
		Uint32 length = 0;
		SDL_RWops *input = nullptr;
		if (info[2].IsString())
			input = SDL_RWFromFile(info[2].As<Napi::String>().Utf8Value().c_str(), "rb");
		else
		{
			auto buffer = info[2].As<Napi::Uint8Array>();
			if (buffer.ByteLength() > static_cast<size_t>(std::numeric_limits<int>::max()))
			{
				Napi::RangeError::New(env, "Sound buffer is too large").ThrowAsJavaScriptException();
				return env.Undefined();
			}
			input = SDL_RWFromConstMem(buffer.Data(), static_cast<int>(buffer.ByteLength()));
		}
		if (!input || !SDL_LoadWAV_RW(input, 1, &source, &data, &length))
		{
			Napi::Error::New(env, std::string("Cannot load WAV: ") + SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		std::unique_ptr<Uint8, decltype(&SDL_FreeWAV)> wav(data, SDL_FreeWAV);
		SDL_AudioCVT conversion{};
		if (SDL_BuildAudioCVT(&conversion, source.format, source.channels, source.freq, engine->spec.format,
		                      engine->spec.channels, engine->spec.freq) < 0)
		{
			Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		if (!length || length > static_cast<Uint32>(std::numeric_limits<int>::max() / conversion.len_mult))
		{
			Napi::RangeError::New(env, "WAV is empty or too large").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		std::vector<Uint8> converted(static_cast<size_t>(length) * conversion.len_mult);
		SDL_memcpy(converted.data(), data, length);
		conversion.buf = converted.data();
		conversion.len = static_cast<int>(length);
		if (conversion.needed && SDL_ConvertAudio(&conversion) != 0)
		{
			Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		size_t bytes = conversion.needed ? conversion.len_cvt : length;
		if (!bytes || bytes % (sizeof(float) * 2))
		{
			Napi::Error::New(env, "Invalid converted WAV samples").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		auto samples = std::make_shared<std::vector<float>>(bytes / sizeof(float));
		SDL_memcpy(samples->data(), converted.data(), bytes);
		for (auto &sample : *samples)
			if (!std::isfinite(sample))
				sample = 0;
		std::string id = info[1].As<Napi::String>().Utf8Value();
		// Existing voices retain their sample buffer when a sound is replaced.
		engine->sounds.insert_or_assign(id, samples);
		return Napi::Number::New(env, samples->size() / (2.0 * engine->spec.freq));
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
		Lock lock(*engine);
		for (auto &voice : engine->voices)
			if (!voice.active)
			{
				if (++engine->nextID == 0)
					++engine->nextID;
				voice = Voice{sound->second,
				              0,
				              engine->nextID,
				              true,
				              false,
				              info[2].As<Napi::Boolean>().Value(),
				              info[3].As<Napi::Number>().FloatValue()};
				return Napi::Number::New(env, voice.id);
			}
		Napi::Error::New(env, "All 32 audio voices are in use").ThrowAsJavaScriptException();
		return env.Undefined();
	}

	Napi::Value control(const Napi::CallbackInfo &info)
	{
		auto env = info.Env();
		auto engine = get(info);
		if (!engine)
			return env.Undefined();
		auto id = info[1].As<Napi::Number>().Uint32Value();
		auto action = info[2].As<Napi::String>().Utf8Value();
		Lock lock(*engine);
		for (auto &voice : engine->voices)
			if (voice.id == id && voice.active)
			{
				if (action == "pause")
					voice.paused = true;
				else if (action == "resume")
					voice.paused = false;
				else if (action == "stop")
				{
					voice.active = false;
					voice.samples.reset();
				}
				else if (action == "volume")
					voice.volume = info[3].As<Napi::Number>().FloatValue();
				else if (action == "state")
					return Napi::String::New(env, (voice.paused || engine->paused) ? "paused" : "playing");
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
		Lock lock(*engine);
		if (action == "volume")
			engine->volume = info[2].As<Napi::Number>().FloatValue();
		else if (action == "pause")
			engine->paused = true;
		else if (action == "resume")
			engine->paused = false;
		else if (action == "stop")
			for (auto &voice : engine->voices)
				voice = Voice{};
		else if (action == "unload")
		{
			auto sound = engine->sounds.find(info[2].As<Napi::String>().Utf8Value());
			if (sound != engine->sounds.end())
			{
				for (auto &voice : engine->voices)
					if (voice.samples == sound->second)
						voice = Voice{};
				engine->sounds.erase(sound);
			}
		}
		return env.Undefined();
	}
}
