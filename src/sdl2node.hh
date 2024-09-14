#include <SDL.h>
#include <SDL_ttf.h>
#include <vector>
#include <string>
#include <cmath>
#include <map>
#include "common.hh"
#include "antialiasing.hh"

#ifdef _WIN32
	#include <windows.h>
#endif

#ifdef _DEBUG
	#include <iostream>
#endif

namespace SDL
{
	struct Position
	{
		int x, y;
	};

	Napi::FunctionReference on_click_callback_ref;
	Napi::FunctionReference on_keydown_callback_ref;
	Napi::FunctionReference on_keyup_callback_ref;
	Napi::FunctionReference on_keysdown_callback_ref;
	Napi::FunctionReference on_keysup_callback_ref;
	Napi::Uint8Array video_buffer;
	SDL_Texture* attached_texture;
	TTF_Font *current_font;
	bool antialiasing = false;
	short scale = 1;

	Napi::Array get_pressed_keys(Napi::Env env)
	{
		int length;
		const Uint8 *sdl_keys = SDL_GetKeyboardState(&length);
		Napi::Array keys = Napi::Array::New(env);
		uint32_t index = 0;
		for (int i = 0; i < length; i++)
		{
			if (sdl_keys[i])
			{
				keys.Set<Napi::String>(index, Napi::String::New(env, SDL_GetScancodeName(SDL_Scancode(i))));
				index++;
			}
		}
		return keys;
	}

	void handle_events(const Napi::Env &env)
	{
		SDL_Event event;
		SDL_PollEvent(&event);

		int x_mouse;
		int y_mouse;

		switch (event.type)
		{
		case SDL_QUIT:
			SDL_Quit();
			TTF_Quit();
			exit(0);
			break;
		case SDL_MOUSEBUTTONDOWN:
			SDL_GetMouseState(&x_mouse, &y_mouse);
			if (on_click_callback_ref.IsEmpty())
				break;
			on_click_callback_ref.Call({Napi::Number::New(env, x_mouse / scale), Napi::Number::New(env, y_mouse / scale)});
			break;
		case SDL_KEYDOWN:
			if (!on_keydown_callback_ref.IsEmpty())
				on_keydown_callback_ref.Call({Napi::String::New(env, SDL_GetKeyName(event.key.keysym.sym))});
			if (!on_keysdown_callback_ref.IsEmpty())
				on_keysdown_callback_ref.Call({get_pressed_keys(env)});
			break;
		case SDL_KEYUP:
			if (!on_keyup_callback_ref.IsEmpty())
				on_keyup_callback_ref.Call({Napi::String::New(env, SDL_GetKeyName(event.key.keysym.sym))});
			if (!on_keysup_callback_ref.IsEmpty())
				on_keysup_callback_ref.Call({get_pressed_keys(env)});
			break;
		default:
			break;
		}
	}

	int read_pixels(SDL_Renderer *renderer, uint8_t *buffer, size_t size, int width, int height, Uint32 format)
	{
		uint8_t bpp;
		switch (format)
		{
		case SDL_PIXELFORMAT_RGB332:
			bpp = 1;
			break;
		case SDL_PIXELFORMAT_RGB565:
			bpp = 2;
			break;
		case SDL_PIXELFORMAT_RGB24:
			bpp = 3;
			break;
		case SDL_PIXELFORMAT_RGBA8888:
			bpp = 4;
			break;
		default:
			bpp = 4;
		}
		if (size < (size_t)(width * height * bpp)) return 1;
		uint8_t *pixels = new uint8_t[width * height * (int)pow(scale, 2) * bpp];
		auto code = SDL_RenderReadPixels(renderer, NULL, format, (void *)pixels, width * scale * bpp);
		if (code) return code;

		size_t index = 0;
		for (int i = 0; i < height; i++)
		{
			for (int j = 0; j < width; j++)
			{
				for (int k = 0; k < bpp; k++)
					buffer[(i * width * bpp) + j] = pixels[index++];
				index += bpp * (scale - 1); 
			}
			index += width * bpp * (scale - 1);
		}
		delete pixels;
		return 0;
	}

	Napi::Value close(const Napi::CallbackInfo& info)
	{
		Napi::Env env = info.Env();
		SDL_Quit();
		TTF_Quit();
		return env.Undefined();
	}

	Napi::Value update(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		if (attached_texture == nullptr) return env.Undefined();
		SDL_Renderer *renderer = GET_RENDERER;
		uint8_t *raw_pixels = video_buffer.Data();
		uint8_t *texture_data;
		int pitch;
		if (SDL_LockTexture(attached_texture, NULL, (void **)&texture_data, &pitch) != 0)
		{
			Napi::Error::New(env, std::string("Unable to lock texture: ") + SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		
		for (size_t i = 0; i < video_buffer.ElementLength(); i++)
		{
			texture_data[i] = raw_pixels[i];
		}

		SDL_UnlockTexture(attached_texture);
		SDL_RenderCopy(renderer, attached_texture, NULL, NULL);
		SDL_RenderPresent(renderer);
		handle_events(env);
		return env.Undefined();
	}

	Napi::Value attach(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		if (attached_texture != nullptr) return env.Undefined();
		SDL_Renderer *renderer = GET_RENDERER;
		video_buffer = info[1].As<Napi::Uint8Array>();
		Uint32 flags = info[2].As<Napi::Number>().Uint32Value();
		int width = info[3].As<Napi::Number>().Int32Value();
		int height = info[4].As<Napi::Number>().Int32Value();
		attached_texture = SDL_CreateTexture(renderer, flags, SDL_TEXTUREACCESS_STREAMING, width, height);
		auto pixels = video_buffer.Data();
		if (read_pixels(renderer, pixels, video_buffer.ElementLength(), width, height, flags) != 0)
		{
			Napi::Error::New(env, std::string("Cannot read pixels: ") + SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		return env.Undefined();
	}

	Napi::Value detach(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_DestroyTexture(attached_texture);
		attached_texture = nullptr;
		return env.Undefined();
	}

	inline Position from_angle(int center_x, int center_y, float angle, int radius)
	{
		float sin = static_cast<float>(std::sin(angle));
		float cos = static_cast<float>(std::cos(angle));
		return Position{static_cast<int>(center_x + cos * radius), static_cast<int>(center_y + sin * radius)};
	}

	inline Napi::Value init(const Napi::CallbackInfo &info)
	{
		#ifdef _WIN32
			SetProcessDPIAware();
		#endif
		
		Napi::Env env = info.Env();
		return Napi::Number::New(env, SDL_Init(SDL_INIT_EVERYTHING));
		SDL_GL_SetAttribute(SDL_GL_RED_SIZE, 8);
		SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE, 8);
		SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE, 8);
		SDL_GL_SetAttribute(SDL_GL_ALPHA_SIZE, 8);

		SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE, 32);

		SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS, 1);
		SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES, 2);

		SDL_GL_SetAttribute(SDL_GL_ACCELERATED_VISUAL, 1);
		SDL_SetHint(SDL_HINT_RENDER_SCALE_QUALITY, "1");
		SDL_SetHint(SDL_HINT_VIDEO_HIGHDPI_DISABLED, "1");
	}

	inline Napi::Value get_error(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		return Napi::String::New(env, SDL_GetError());
	}

	Napi::Value create_window(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		std::string title = info[0].As<Napi::String>().Utf8Value();
		int x = info[1].As<Napi::Number>().Int64Value();
		int y = info[2].As<Napi::Number>().Int64Value();
		int w = info[3].As<Napi::Number>().Int64Value();
		int h = info[4].As<Napi::Number>().Int64Value();
		Uint32 flags = info[5].As<Napi::Number>().Uint32Value();
		scale = info[6].As<Napi::Number>().Int32Value();

		SDL_Window *window = SDL_CreateWindow(title.c_str(), x, y, w * scale, h * scale, flags | SDL_WINDOW_ALLOW_HIGHDPI);
		if (window == NULL)
			return env.Undefined();
		return Napi::ArrayBuffer::New(env, window, sizeof(window));
	}

	Napi::Value create_renderer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		int index = info[1].As<Napi::Number>().Int64Value();
		Uint32 flags = info[2].As<Napi::Number>().Uint32Value();
		TTF_Init();
		SDL_Renderer *renderer = SDL_CreateRenderer(window, index, flags | SDL_RENDERER_PRESENTVSYNC | SDL_RENDERER_ACCELERATED);
		int w, h;
		SDL_GetWindowSize(window, &w, &h);
		SDL_RenderSetLogicalSize(renderer, w / scale, h / scale);
		if (renderer == NULL)
			return env.Undefined();
		SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);
		return Napi::ArrayBuffer::New(env, renderer, sizeof(renderer));
	}

	Napi::Value show_window(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		SDL_ShowWindow(window);
		return env.Undefined();
	}

	Napi::Value hide_window(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		SDL_HideWindow(window);
		return env.Undefined();
	}

	Napi::Value set_render_draw_color(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		int red = info[1].As<Napi::Number>().Int64Value();
		int green = info[2].As<Napi::Number>().Int64Value();
		int blue = info[3].As<Napi::Number>().Int64Value();
		int alpha = info[4].As<Napi::Number>().Int64Value();
		handle_events(env);
		return Napi::Number::New(env, SDL_SetRenderDrawColor(renderer, red, green, blue, alpha));
	}

	inline Napi::Value render_clear(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		return Napi::Number::New(env, SDL_RenderClear(renderer));
	}

	Napi::Value render_present(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_RenderPresent(renderer);
		handle_events(env);
		return env.Undefined();
	}

	inline Napi::Value delay(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		int ms = info[0].As<Napi::Number>().Int64Value();
		SDL_Delay(ms);
		handle_events(env);
		return env.Undefined();
	}

	Napi::Value render_draw_point(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		int px = info[1].As<Napi::Number>().Int64Value();
		int py = info[2].As<Napi::Number>().Int64Value();
		handle_events(env);
		return Napi::Number::New(env, SDL_RenderDrawPoint(renderer, px, py));
	}

	Napi::Value render_draw_line(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		int x1 = info[1].As<Napi::Number>().Int64Value();
		int y1 = info[2].As<Napi::Number>().Int64Value();
		int x2 = info[3].As<Napi::Number>().Int64Value();
		int y2 = info[4].As<Napi::Number>().Int64Value();
		handle_events(env);
		if (antialiasing)
		{
			AA::draw_line_aa(renderer, x1, y1, x2, y2);
			return Napi::Number::New(env, 0);
		}
		return Napi::Number::New(env, SDL_RenderDrawLine(renderer, x1, y1, x2, y2));
	}

	Napi::Value render_copy(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_Texture *texture = (SDL_Texture *)get_ptr_from_js(info[1].As<Napi::ArrayBuffer>());
		handle_events(env);
		return Napi::Number::New(env, SDL_RenderCopy(renderer, texture, NULL, NULL));
	}

	Napi::Value draw_rectangle(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		int x = info[1].As<Napi::Number>().Int64Value();
		int y = info[2].As<Napi::Number>().Int64Value();
		int w = info[3].As<Napi::Number>().Int64Value();
		int h = info[4].As<Napi::Number>().Int64Value();
		bool fill = info[5].As<Napi::Boolean>().Value();
		SDL_Rect rect;
		rect.x = x;
		rect.y = y;
		rect.w = w;
		rect.h = h;
		handle_events(env);
		if (fill)
			return Napi::Number::New(env, SDL_RenderFillRect(renderer, &rect));
		return Napi::Number::New(env, SDL_RenderDrawRect(renderer, &rect));
	}

	Napi::Value create_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		Uint32 flags = info[1].As<Napi::Number>().Uint32Value();
		int access = info[2].As<Napi::Number>().Int64Value();
		int w = info[3].As<Napi::Number>().Int64Value();
		int h = info[4].As<Napi::Number>().Int64Value();
		SDL_Texture *texture = SDL_CreateTexture(renderer, flags, access, w, h);
		handle_events(env);
		return Napi::ArrayBuffer::New(env, texture, sizeof(texture));
	}

	Napi::Value write_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Texture *texture = (SDL_Texture *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		Napi::Uint8Array pixels = info[1].As<Napi::Uint8Array>();
		uint8_t *raw_pixels = pixels.Data();
		uint8_t *texture_data;
		int pitch;
		if (SDL_LockTexture(texture, NULL, (void **)&texture_data, &pitch) != 0)
		{
			throw Napi::Error::New(env, std::string("Unable to lock texture: ") + SDL_GetError());
		}
		for (size_t i = 0; i < pixels.ElementLength(); i++)
		{
			texture_data[i] = raw_pixels[i];
		}

		SDL_UnlockTexture(texture);
		handle_events(env);
		return env.Undefined();
	}

	Napi::Value delete_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Texture *texture = (SDL_Texture *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		SDL_DestroyTexture(texture);
		handle_events(env);
		return env.Undefined();
	}

	Napi::Value read_render(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		int width = info[1].As<Napi::Number>().Int64Value();
		int height = info[2].As<Napi::Number>().Int64Value();
		size_t size = width * height * 4;
		uint8_t *pixels = new uint8_t[size];
		if (read_pixels(renderer, pixels, size, width, height, SDL_PIXELFORMAT_RGBA8888) != 0)
		{
			throw Napi::Error::New(env, std::string("Cannot read data: ") + SDL_GetError());
		}
		handle_events(env);
		return Napi::ArrayBuffer::New(env, (void *)pixels, size);
	}

	Napi::Value set_scale(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		int width = info[1].As<Napi::Number>().Int64Value();
		int height = info[2].As<Napi::Number>().Int64Value();
		int scale = info[3].As<Napi::Number>().Int64Value();
		if (SDL_RenderSetLogicalSize(renderer, width * scale, height * scale) != 0)
		{
			throw Napi::Error::New(env, std::string("Cannot set the render scale: ") + SDL_GetError());
		}
		handle_events(env);
		return env.Undefined();
	}

	Napi::Value on_click(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		on_click_callback_ref = Napi::Persistent(info[0].As<Napi::Function>());
		return env.Undefined();
	}

	inline Napi::Value on_keydown(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		on_keydown_callback_ref = Napi::Persistent(info[0].As<Napi::Function>());
		return env.Undefined();
	}

	inline Napi::Value on_keyup(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		on_keyup_callback_ref = Napi::Persistent(info[0].As<Napi::Function>());
		return env.Undefined();
	}

	inline Napi::Value on_keysdown(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		on_keysdown_callback_ref = Napi::Persistent(info[0].As<Napi::Function>());
		return env.Undefined();
	}

	inline Napi::Value on_keysup(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		on_keysup_callback_ref = Napi::Persistent(info[0].As<Napi::Function>());
		return env.Undefined();
	}

	inline Napi::Value get_ticks(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		return Napi::Number::New(env, SDL_GetTicks());
	}

	Napi::Value set_antialias(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		antialiasing = true;
		return env.Undefined();
	}

	Napi::Value clear_antialias(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		antialiasing = false;
		return env.Undefined();
	}

	inline Napi::Value set_font(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		current_font = TTF_OpenFont(info[0].As<Napi::String>().Utf8Value().c_str(), info[1].As<Napi::Number>().Int32Value());
		return env.Undefined();
	}

	Napi::Value get_screen_resolution(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_DisplayMode mode;
		SDL_GetDesktopDisplayMode(0, &mode);
		Napi::Object res = Napi::Object::New(env);
		res.Set(Napi::String::New(env, "w"), Napi::Number::New(env, mode.w));
		res.Set(Napi::String::New(env, "h"), Napi::Number::New(env, mode.h));
		return res;
	}

	Napi::Value draw_text(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Renderer *renderer = GET_RENDERER;
		SDL_Color color = {
			static_cast<Uint8>(info[2].As<Napi::Number>().Uint32Value()),
			static_cast<Uint8>(info[3].As<Napi::Number>().Uint32Value()),
			static_cast<Uint8>(info[4].As<Napi::Number>().Uint32Value()),
			255};
		SDL_Surface *surface = TTF_RenderText_Solid(current_font, info[1].As<Napi::String>().Utf8Value().c_str(), color);

		SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
		int texW = 0;
		int texH = 0;
		int x = info[5].As<Napi::Number>().Int32Value();
		int y = info[6].As<Napi::Number>().Int32Value();
		SDL_QueryTexture(texture, NULL, NULL, &texW, &texH);
		SDL_Rect dstrect = {x, y, texW, texH};
		SDL_RenderCopy(renderer, texture, NULL, &dstrect);
		handle_events(env);
		return env.Undefined();
	}

	Napi::Value draw_arc(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		const float precision = (float)0.05f;
		SDL_Renderer *renderer = GET_RENDERER;
		int x = info[1].As<Napi::Number>().Int32Value();
		int y = info[2].As<Napi::Number>().Int32Value();
		int radius = info[3].As<Napi::Number>().Int32Value();
		double angle1 = info[4].As<Napi::Number>().DoubleValue();
		double angle2 = info[5].As<Napi::Number>().DoubleValue();
		if (antialiasing)
		{
			AA::draw_arc_aa(renderer, x, y, radius, angle1, angle2);
			return env.Undefined();
		}
		Position pos = from_angle(x, y, angle1, radius), temp;
		while (angle1 < angle2)
		{
			angle1 += precision;
			temp = from_angle(x, y, angle1, radius);
			SDL_RenderDrawLine(renderer, pos.x, pos.y, temp.x, temp.y);
			pos = temp;
		}
		return env.Undefined();
	}

	Napi::Value get_mouse_pos(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		int x, y;
		SDL_GetMouseState(&x, &y);
		Napi::Object res = Napi::Object::New(env);
		res.Set(Napi::String::New(env, "x"), Napi::Number::New(env, x / scale));
		res.Set(Napi::String::New(env, "y"), Napi::Number::New(env, y / scale));
		return res;
	}

	Napi::Value remove_borders(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		SDL_SetWindowBordered(window, SDL_FALSE);
		return env.Undefined();
	}
}