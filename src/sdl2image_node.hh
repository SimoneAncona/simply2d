#pragma once
#include <SDL_image.h>
#include <map>
#include <string>
#include "common.hh"
#ifdef _DEBUG
	#include <iostream>
#endif

namespace SDLImage
{
	struct Layer
	{
		SDL_Texture *texture;
		bool is_active;
	};

	std::map<std::string, SDL_Texture *> textures;
	std::map<std::string, Layer> layers;
	std::string current_layer;

	Napi::Value init(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		current_layer = "";
		int flags = info[0].As<Napi::Number>().Int64Value();
		return Napi::Number::New(env, IMG_Init(flags));
	}

	Napi::Value load_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		std::string filename = info[1].As<Napi::String>().Utf8Value();
		SDL_Texture *texture = IMG_LoadTexture(renderer, filename.c_str());
		if (texture == NULL)
			return env.Undefined();
		return Napi::ArrayBuffer::New(env, texture, sizeof(texture));
	}

	Napi::Value save_jpg(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
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
		SDL_Renderer *renderer = GET_RENDERER;
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
		SDL_Renderer *renderer = GET_RENDERER;
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
		SDL_Renderer *renderer = GET_RENDERER;
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

	Napi::Value add_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		std::string layer_id = info[1].As<Napi::String>().Utf8Value();
		Uint32 format = info[2].As<Napi::Number>().Uint32Value();
		int w = info[3].As<Napi::Number>().Int32Value();
		int h = info[4].As<Napi::Number>().Int32Value();
		SDL_Texture *texture = SDL_CreateTexture(renderer, format, SDL_TEXTUREACCESS_TARGET, w, h);
		SDL_SetTextureBlendMode(texture, SDL_BLENDMODE_BLEND);

		layers.insert_or_assign(layer_id, Layer{ texture, true });
		return env.Undefined();
	}

	Napi::Value set_current_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_RendererInfo r_info;
		current_layer = info[1].As<Napi::String>().Utf8Value();
		SDL_GetRendererInfo(renderer, &r_info);
		if (!(r_info.flags & SDL_RENDERER_TARGETTEXTURE))
		{
			return env.Undefined();
		}
		SDL_SetRenderTarget(renderer, layers.at(current_layer).texture);
		return env.Undefined();
	}

	Napi::Value clear_current_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_SetRenderTarget(renderer, NULL);
		current_layer = "";
		return env.Undefined();
	}

	Napi::Value render_layers(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		for (auto layer : layers)
		{
			if (layer.second.is_active)
			{
				SDL_SetRenderTarget(renderer, NULL);
				SDL_RenderCopy(renderer, layer.second.texture, NULL, NULL);
				if (current_layer != "") SDL_SetRenderTarget(renderer, layers.at(current_layer).texture);
			}

		}
		return env.Undefined();
	}

	Napi::Value remove_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		std::string id = info[0].As<Napi::String>().Utf8Value();
		SDL_DestroyTexture(layers.at(id).texture);
		layers.erase(id);
		if (id == current_layer)
			current_layer = "";
		return env.Undefined();
	}

	Napi::Value get_texture_res(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		int texW = 0;
		int texH = 0;
		SDL_Renderer *renderer = GET_RENDERER;
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

	Napi::Value get_layers(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		Napi::Array napi_layers = Napi::Array::New(env);
		size_t i = 0;
		for (auto layer : layers) 
		{
			auto object = Napi::Object::New(env);
			object.Set(Napi::String::New(env, "id"), Napi::String::New(env, layer.first));
			object.Set(Napi::String::New(env, "isActive"), Napi::Boolean::New(env, layer.second.is_active));
			napi_layers.Set(i, object);
			i++;
		}
		return napi_layers;
	}

	Napi::Value activate_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		auto layer = info[0].As<Napi::String>().Utf8Value();
		layers.at(layer).is_active = true;
		return env.Undefined();
	}

	Napi::Value deactivate_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		auto layer = info[0].As<Napi::String>().Utf8Value();
		layers.at(layer).is_active = false;
		return env.Undefined();
	}
}