#include <algorithm>
#pragma once
#include <SDL_image.h>
#include <map>
#include <string>
#include <vector>
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
	struct Texture
	{
		SDL_Texture *texture;
		int width, height;
	};

	std::map<std::string, Texture> textures;
	std::map<std::string, Layer> layers;
	std::vector<std::string> layers_order;
	std::string current_layer;

	bool resize_targets(SDL_Renderer *renderer, int width, int height)
	{
		SDL_Texture *target = SDL_GetRenderTarget(renderer);
		std::vector<SDL_Texture **> targets{ &SDL::main_targets.at(renderer) };
		for (auto &layer : layers) targets.push_back(&layer.second.texture);
		std::vector<SDL_Texture *> replacements;
		for (auto old : targets)
		{
			Uint32 format;
			SDL_QueryTexture(*old, &format, nullptr, nullptr, nullptr);
			SDL_Texture *texture = SDL_CreateTexture(renderer, format, SDL_TEXTUREACCESS_TARGET, width, height);
			if (!texture)
			{
				for (auto created : replacements) SDL_DestroyTexture(created);
				return false;
			}
			replacements.push_back(texture);
		}
		Uint8 red, green, blue, alpha;
		SDL_GetRenderDrawColor(renderer, &red, &green, &blue, &alpha);
		SDL_RenderSetLogicalSize(renderer, width, height);
		for (size_t i = 0; i < targets.size(); i++)
		{
			SDL_Texture *old = *targets[i];
			SDL_Texture *replacement = replacements[i];
			SDL_BlendMode blend;
			SDL_GetTextureBlendMode(old, &blend);
			SDL_SetTextureBlendMode(replacement, blend);
			SDL_SetRenderTarget(renderer, replacement);
			SDL_SetRenderDrawColor(renderer, 0, 0, 0, i == 0 ? 255 : 0);
			SDL_RenderClear(renderer);
			SDL_Rect destination{0, 0, 0, 0};
			SDL_QueryTexture(old, nullptr, nullptr, &destination.w, &destination.h);
			SDL_SetTextureBlendMode(old, SDL_BLENDMODE_NONE);
			SDL_RenderCopy(renderer, old, nullptr, &destination);
			if (target == old) target = replacement;
			*targets[i] = replacement;
			SDL_DestroyTexture(old);
		}
		SDL_SetRenderTarget(renderer, target);
		SDL_SetRenderDrawColor(renderer, red, green, blue, alpha);
		return true;
	}

	void reset_state()
	{
		textures.clear();
		layers.clear();
		layers_order.clear();
		current_layer.clear();
	}

	void compose_frame(SDL_Renderer *renderer)
	{
		SDL_SetRenderTarget(renderer, nullptr);
		SDL_RenderCopy(renderer, SDL::main_targets.at(renderer), nullptr, nullptr);
		for (const auto &layer_id : layers_order)
		{
			const auto &layer = layers.at(layer_id);
			if (layer.is_active) SDL_RenderCopy(renderer, layer.texture, nullptr, nullptr);
		}
	}

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
		SDL_FreeSurface(surface);
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
		SDL_FreeSurface(surface);
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
		{
			Napi::Error::New(env, std::string("Cannot load texture: ") + SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		int width, height;
		SDL_QueryTexture(texture, nullptr, nullptr, &width, &height);
		auto previous = textures.find(id);
		if (previous != textures.end()) SDL_DestroyTexture(previous->second.texture);
		textures.insert_or_assign(id, Texture{texture, width, height});
		return env.Undefined();
	}

	Napi::Value load_svg(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_RWops *input = nullptr;
		if (info[2].IsString()) input = SDL_RWFromFile(info[2].As<Napi::String>().Utf8Value().c_str(), "rb");
		else {
			auto buffer = info[2].As<Napi::Uint8Array>();
			if (buffer.ByteLength() > static_cast<size_t>(2147483647)) {
				Napi::RangeError::New(env, "SVG buffer is too large").ThrowAsJavaScriptException(); return env.Undefined();
			}
			input = SDL_RWFromConstMem(buffer.Data(), static_cast<int>(buffer.ByteLength()));
		}
		if (!input) { Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException(); return env.Undefined(); }
		SDL_Surface *surface = IMG_LoadSizedSVG_RW(input, info[3].As<Napi::Number>().Int32Value(), info[4].As<Napi::Number>().Int32Value());
		std::string error = SDL_GetError();
		SDL_RWclose(input);
		if (!surface) { Napi::Error::New(env, "Cannot load SVG: " + error).ThrowAsJavaScriptException(); return env.Undefined(); }
		SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
		int width = surface->w, height = surface->h;
		SDL_FreeSurface(surface);
		if (!texture) { Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException(); return env.Undefined(); }
		std::string id = info[1].As<Napi::String>().Utf8Value();
		auto previous = textures.find(id);
		if (previous != textures.end()) SDL_DestroyTexture(previous->second.texture);
		textures.insert_or_assign(id, Texture{texture, width, height});
		return env.Undefined();
	}

	Napi::Value unload_texture(const Napi::CallbackInfo &info)
	{
		auto entry = textures.find(info[0].As<Napi::String>().Utf8Value());
		if (entry != textures.end())
		{
			SDL_DestroyTexture(entry->second.texture);
			textures.erase(entry);
		}
		return info.Env().Undefined();
	}

	Napi::Value draw_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		float x = info[1].As<Napi::Number>().FloatValue();
		float y = info[2].As<Napi::Number>().FloatValue();
		std::string id = info[3].As<Napi::String>().Utf8Value();
		auto entry = textures.find(id);
		if (entry == textures.end())
		{
			Napi::Error::New(env, "Texture is not loaded: " + id).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		const auto &cached = entry->second;
		Napi::Object options = info.Length() > 4 && info[4].IsObject() ? info[4].As<Napi::Object>() : Napi::Object::New(env);
		SDL_Rect source{0, 0, cached.width, cached.height};
		if (options.Has("source"))
		{
			Napi::Object rect = options.Get("source").As<Napi::Object>();
			source = {rect.Get("x").As<Napi::Number>().Int32Value(), rect.Get("y").As<Napi::Number>().Int32Value(),
				rect.Get("width").As<Napi::Number>().Int32Value(), rect.Get("height").As<Napi::Number>().Int32Value()};
		}
		float width = options.Has("width") ? options.Get("width").As<Napi::Number>().FloatValue() : source.w;
		float height = options.Has("height") ? options.Get("height").As<Napi::Number>().FloatValue() : source.h;
		double angle = options.Has("rotation") ? options.Get("rotation").As<Napi::Number>().DoubleValue() : 0;
		double opacity = options.Has("opacity") ? options.Get("opacity").As<Napi::Number>().DoubleValue() : 1;
		if (source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
			|| source.x > cached.width - source.w || source.y > cached.height - source.h
			|| !std::isfinite(x) || !std::isfinite(y) || !std::isfinite(width) || !std::isfinite(height)
			|| width <= 0 || height <= 0 || !std::isfinite(angle) || !std::isfinite(opacity) || opacity < 0 || opacity > 1)
		{
			Napi::RangeError::New(env, "Invalid texture rectangle or drawing options").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		int flip = SDL_FLIP_NONE;
		if (options.Has("flipX") && options.Get("flipX").As<Napi::Boolean>().Value()) flip |= SDL_FLIP_HORIZONTAL;
		if (options.Has("flipY") && options.Get("flipY").As<Napi::Boolean>().Value()) flip |= SDL_FLIP_VERTICAL;
		std::string filtering = options.Has("filtering") ? options.Get("filtering").As<Napi::String>().Utf8Value() : "nearest";
		if (filtering != "nearest" && filtering != "linear")
		{
			Napi::RangeError::New(env, "Texture filtering must be nearest or linear").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		SDL_SetTextureScaleMode(cached.texture, filtering == "linear" ? SDL_ScaleModeLinear : SDL_ScaleModeNearest);
		SDL_FRect destination{x, y, width, height};
		SDL_SetTextureAlphaMod(cached.texture, static_cast<Uint8>(std::round(opacity * 255)));
		int result = SDL_RenderCopyExF(renderer, cached.texture, &source, &destination, angle, nullptr, static_cast<SDL_RendererFlip>(flip));
		SDL_SetTextureAlphaMod(cached.texture, 255);
		if (result != 0) Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException();
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
		layers_order.push_back(layer_id);
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
		SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);
		return env.Undefined();
	}

	Napi::Value clear_current_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_SetRenderTarget(renderer, SDL::main_targets.at(renderer));
		current_layer = "";
		return env.Undefined();
	}

	Napi::Value render_layers(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_Texture *target = SDL_GetRenderTarget(renderer);
		compose_frame(renderer);
		SDL_SetRenderTarget(renderer, target);
		return env.Undefined();
	}

	Napi::Value remove_layer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		std::string id = info[0].As<Napi::String>().Utf8Value();
		SDL_DestroyTexture(layers.at(id).texture);
		layers.erase(id);
		auto el = std::find(layers_order.begin(), layers_order.end(), id);
		if (el != layers_order.end())
			layers_order.erase(el);
		if (id == current_layer)
			current_layer = "";
		return env.Undefined();
	}

	Napi::Value get_texture_res(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		std::string id = info[1].As<Napi::String>().Utf8Value();
		auto entry = textures.find(id);
		if (entry == textures.end()) {
			Napi::Error::New(env, "Texture is not loaded: " + id).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		Napi::Object res = Napi::Object::New(env);
		res.Set("w", entry->second.width);
		res.Set("h", entry->second.height);
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
		for (auto layer : layers_order) 
		{
			auto object = Napi::Object::New(env);
			object.Set(Napi::String::New(env, "id"), Napi::String::New(env, layer));
			object.Set(Napi::String::New(env, "isActive"), Napi::Boolean::New(env, layers.at(layer).is_active));
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

	Napi::Value clear_all(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_Texture *target = SDL_GetRenderTarget(renderer);
		SDL_SetRenderTarget(renderer, SDL::main_targets.at(renderer));
		SDL_RenderClear(renderer);
		for (auto layer : layers)
		{
			SDL_SetRenderTarget(renderer, layer.second.texture);
			SDL_RenderClear(renderer);
		}
		SDL_SetRenderTarget(renderer, target);
		return env.Undefined();
	}

	Napi::Value move_layer(const Napi::CallbackInfo& info)
	{
		Napi::Env env = info.Env();
		std::string layer_id = info[0].As<Napi::String>().Utf8Value();
		bool move_up = info[1].As<Napi::Boolean>().Value();
		int steps = info[2].As<Napi::Number>().Int32Value();
		auto el = std::find(layers_order.begin(), layers_order.end(), layer_id);
		
		if (el == layers_order.end()) return env.Undefined();

		auto new_pos = el;

		if (move_up)
			new_pos += steps;
		else
			new_pos -= steps;
		
		if (new_pos >= layers_order.end())
			new_pos = layers_order.end() - 1;
		else if (new_pos <= layers_order.begin())
			new_pos = layers_order.begin();
		
		std::swap(*el, *new_pos);
		return env.Undefined();
	}
}
