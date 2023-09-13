#pragma once
#include <SDL_image.h>
#include <map>
#include <string>
#include "common.hh"

namespace SDLImage
{
	std::map<std::string, SDL_Texture *> textures;

	Napi::Value init(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		int flags = info[0].As<Napi::Number>().Int64Value();
		return Napi::Number::New(env, IMG_Init(flags));
	}

	Napi::Value load_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		std::string filename = info[1].As<Napi::String>().Utf8Value();
		SDL_Texture *texture = IMG_LoadTexture(renderer, filename.c_str());
		if (texture == NULL)
			return env.Undefined();
		return Napi::ArrayBuffer::New(env, texture, sizeof(texture));
	}

	Napi::Value save_jpg(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		int width = info[1].As<Napi::Number>().Int64Value();
		int height = info[2].As<Napi::Number>().Int64Value();
		std::string filename = info[3].As<Napi::String>().Utf8Value();

		auto format = SDL_PIXELFORMAT_RGB888;

		SDL_Surface *surface = SDL_CreateRGBSurfaceWithFormat(0, width, height, 24, format);
		SDL_RenderReadPixels(renderer, NULL, format, surface->pixels, surface->pitch);
		IMG_SaveJPG(surface, filename.c_str(), 80);
		return env.Undefined();
	}

	Napi::Value save_png(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		int width = info[1].As<Napi::Number>().Int64Value();
		int height = info[2].As<Napi::Number>().Int64Value();
		std::string filename = info[3].As<Napi::String>().Utf8Value();

		auto format = SDL_PIXELFORMAT_RGBA8888;

		SDL_Surface *surface = SDL_CreateRGBSurfaceWithFormat(0, width, height, 32, format);
		SDL_RenderReadPixels(renderer, NULL, format, surface->pixels, surface->pitch);
		IMG_SavePNG(surface, filename.c_str());
		return env.Undefined();
	}

	Napi::Value save_single_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		std::string id = info[1].As<Napi::String>().Utf8Value();
		std::string filename = info[2].As<Napi::String>().Utf8Value();
		SDL_Texture *texture = IMG_LoadTexture(renderer, filename.c_str());
		if (texture == NULL)
			return env.Undefined();
		textures.insert_or_assign(id, texture);
		return env.Undefined();
	}

	Napi::Value draw_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		int x = info[1].As<Napi::Number>().Int32Value();
		int y = info[2].As<Napi::Number>().Int32Value();
		int texW = 0;
		int texH = 0;
		std::string id = info[3].As<Napi::String>().Utf8Value();
		SDL_Texture *texture = textures.at(id);
		SDL_QueryTexture(texture, NULL, NULL, &texW, &texH);
		SDL_Rect dstrect = {x, y, texW, texH};
		SDL_RenderCopy(renderer, texture, NULL, &dstrect);
		return env.Undefined();
	}

	Napi::Value get_texture_res(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		int texW = 0;
		int texH = 0;
		SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		std::string id = info[1].As<Napi::String>().Utf8Value();
		SDL_Texture *texture = textures.at(id);
		SDL_QueryTexture(texture, NULL, NULL, &texW, &texH);
		Napi::Object res = Napi::Object::New(env);
		res.Set(Napi::String::New(env, "w"), Napi::Number::New(env, texW));
		res.Set(Napi::String::New(env, "h"), Napi::Number::New(env, texH));
		return res;
	}

	inline Napi::Value quit(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		IMG_Quit();
		return env.Undefined();
	}
}