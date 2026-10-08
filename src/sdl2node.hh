#include <SDL.h>
#include <SDL_ttf.h>
#include <vector>
#include <string>
#include <cmath>
#include <map>
#include <cstring>
#include <algorithm>
#include "common.hh"
#include "antialiasing.hh"

#ifdef _WIN32
#include <windows.h>
#endif

#ifdef _DEBUG
#include <iostream>
#endif

namespace SDLImage
{
	void compose_frame(SDL_Renderer *renderer);
	void reset_state();
	bool resize_targets(SDL_Renderer *renderer, int width, int height);
}

namespace SDL
{
	struct Position
	{
		int x, y;
	};

	std::map<Uint32, Napi::FunctionReference> window_event_callbacks;
	Napi::FunctionReference on_click_callback_ref;
	Napi::FunctionReference on_keydown_callback_ref;
	Napi::FunctionReference on_keyup_callback_ref;
	Napi::FunctionReference on_keysdown_callback_ref;
	Napi::FunctionReference on_keysup_callback_ref;
	Napi::Reference<Napi::Uint8Array> video_buffer;
	SDL_Texture *attached_texture;
	std::map<SDL_Renderer *, SDL_Texture *> main_targets;

	void present_frame(SDL_Renderer *renderer)
	{
		SDL_Texture *target = SDL_GetRenderTarget(renderer);
		SDLImage::compose_frame(renderer);
		SDL_RenderPresent(renderer);
		SDL_SetRenderTarget(renderer, target);
	}
	TTF_Font *current_font = nullptr;
	std::map<std::pair<std::string, int>, TTF_Font *> fonts;
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
		SDL_Event event{};
		while (SDL_PollEvent(&event))
		{
			switch (event.type)
			{
				case SDL_QUIT:
					// Window close requests are handled below; never terminate the host process.
					break;
				case SDL_WINDOWEVENT:
				{
					auto handler = window_event_callbacks.find(event.window.windowID);
					if (handler == window_event_callbacks.end())
						break;
					const char *type = nullptr;
					int first = event.window.data1, second = event.window.data2;
					switch (event.window.event)
					{
						case SDL_WINDOWEVENT_SIZE_CHANGED:
						{
							SDL_Window *window = SDL_GetWindowFromID(event.window.windowID);
							SDL_Renderer *renderer = window ? SDL_GetRenderer(window) : nullptr;
							first = std::max(1, first / scale);
							second = std::max(1, second / scale);
							if (!renderer || !SDLImage::resize_targets(renderer, first, second))
							{
								Napi::Error::New(env, std::string("Cannot resize framebuffer: ") + SDL_GetError())
								    .ThrowAsJavaScriptException();
								return;
							}
							type = "resize";
							break;
						}
						case SDL_WINDOWEVENT_MOVED:
							type = "move";
							break;
						case SDL_WINDOWEVENT_FOCUS_GAINED:
							type = "focus";
							break;
						case SDL_WINDOWEVENT_FOCUS_LOST:
							type = "unfocus";
							break;
						case SDL_WINDOWEVENT_MINIMIZED:
							type = "minimize";
							break;
						case SDL_WINDOWEVENT_MAXIMIZED:
							type = "maximize";
							break;
						case SDL_WINDOWEVENT_RESTORED:
							type = "restore";
							break;
						case SDL_WINDOWEVENT_SHOWN:
							type = "show";
							break;
						case SDL_WINDOWEVENT_HIDDEN:
							type = "hide";
							break;
						case SDL_WINDOWEVENT_ENTER:
							type = "mouseEnter";
							break;
						case SDL_WINDOWEVENT_LEAVE:
							type = "mouseLeave";
							break;
						case SDL_WINDOWEVENT_CLOSE:
							type = "close";
							break;
						default:
							break;
					}
					if (type)
					{
						Napi::Function callback = handler->second.Value();
						callback.Call({Napi::String::New(env, type), Napi::Number::New(env, first),
						               Napi::Number::New(env, second)});
					}
					break;
				}
				case SDL_MOUSEBUTTONDOWN:
					if (!on_click_callback_ref.IsEmpty())
						on_click_callback_ref.Call({Napi::Number::New(env, event.button.x / scale),
						                            Napi::Number::New(env, event.button.y / scale)});
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
			if (env.IsExceptionPending() || SDL_WasInit(SDL_INIT_VIDEO) == 0)
				return;
		}
	}

	Napi::Value poll_events(const Napi::CallbackInfo &info)
	{
		handle_events(info.Env());
		return info.Env().Undefined();
	}

	Napi::Value on_window_event(const Napi::CallbackInfo &info)
	{
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		window_event_callbacks.insert_or_assign(SDL_GetWindowID(window),
		                                        Napi::Persistent(info[1].As<Napi::Function>()));
		return info.Env().Undefined();
	}

	Napi::Value resize_window(const Napi::CallbackInfo &info)
	{
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		SDL_SetWindowSize(window, info[1].As<Napi::Number>().Int32Value(), info[2].As<Napi::Number>().Int32Value());
		return info.Env().Undefined();
	}

	Napi::Value request_window_close(const Napi::CallbackInfo &info)
	{
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		SDL_Event event{};
		event.type = SDL_WINDOWEVENT;
		event.window.windowID = SDL_GetWindowID(window);
		event.window.event = SDL_WINDOWEVENT_CLOSE;
		if (SDL_PushEvent(&event) < 0)
			Napi::Error::New(info.Env(), SDL_GetError()).ThrowAsJavaScriptException();
		return info.Env().Undefined();
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
		if (size < (size_t)(width * height * bpp))
			return 1;
		const int read_scale = SDL_GetRenderTarget(renderer) == nullptr ? scale : 1;
		const int pitch = width * read_scale * bpp;
		std::vector<uint8_t> pixels((size_t)pitch * height * read_scale);
		SDL_Rect rect{0, 0, width * read_scale, height * read_scale};
		auto code = SDL_RenderReadPixels(renderer, &rect, format, pixels.data(), pitch);
		if (code)
			return code;

		for (int y = 0; y < height; y++)
			for (int x = 0; x < width; x++)
				std::memcpy(buffer + (y * width + x) * bpp,
				            pixels.data() + y * read_scale * pitch + x * read_scale * bpp, bpp);
		return 0;
	}

	Napi::Value close(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		for (auto &entry : main_targets)
			SDL_DestroyTexture(entry.second);
		main_targets.clear();
		window_event_callbacks.clear();
		on_click_callback_ref.Reset();
		on_keydown_callback_ref.Reset();
		on_keyup_callback_ref.Reset();
		on_keysdown_callback_ref.Reset();
		on_keysup_callback_ref.Reset();
		SDLImage::reset_state();
		for (auto &entry : fonts)
			TTF_CloseFont(entry.second);
		fonts.clear();
		current_font = nullptr;
		SDL_QuitSubSystem(SDL_INIT_VIDEO | SDL_INIT_EVENTS | SDL_INIT_TIMER);
		TTF_Quit();
		return env.Undefined();
	}

	Napi::Value update(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		if (attached_texture == nullptr)
			return env.Undefined();
		SDL_Renderer *renderer = GET_RENDERER;
		uint8_t *raw_pixels = video_buffer.Value().Data();
		uint8_t *texture_data;
		int pitch;
		if (SDL_LockTexture(attached_texture, NULL, (void **)&texture_data, &pitch) != 0)
		{
			Napi::Error::New(env, std::string("Unable to lock texture: ") + SDL_GetError())
			    .ThrowAsJavaScriptException();
			return env.Undefined();
		}

		Uint32 format;
		int width, height;
		SDL_QueryTexture(attached_texture, &format, nullptr, &width, &height);
		const int row_size = width * SDL_BYTESPERPIXEL(format);
		for (int y = 0; y < height; y++)
			std::memcpy(texture_data + y * pitch, raw_pixels + y * row_size, row_size);

		SDL_UnlockTexture(attached_texture);
		SDL_RenderCopy(renderer, attached_texture, NULL, NULL);
		present_frame(renderer);
		handle_events(env);
		return env.Undefined();
	}

	Napi::Value attach(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		if (attached_texture != nullptr)
			return env.Undefined();
		SDL_Renderer *renderer = GET_RENDERER;
		auto buffer = info[1].As<Napi::Uint8Array>();
		Uint32 flags = info[2].As<Napi::Number>().Uint32Value();
		int width = info[3].As<Napi::Number>().Int32Value();
		int height = info[4].As<Napi::Number>().Int32Value();
		attached_texture = SDL_CreateTexture(renderer, flags, SDL_TEXTUREACCESS_STREAMING, width, height);
		if (attached_texture == nullptr)
		{
			Napi::Error::New(env, std::string("Cannot create attached texture: ") + SDL_GetError())
			    .ThrowAsJavaScriptException();
			return env.Undefined();
		}
		if (read_pixels(renderer, buffer.Data(), buffer.ElementLength(), width, height, flags) != 0)
		{
			SDL_DestroyTexture(attached_texture);
			attached_texture = nullptr;
			Napi::Error::New(env, std::string("Cannot read pixels: ") + SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		video_buffer = Napi::Persistent(buffer);
		return env.Undefined();
	}

	Napi::Value detach(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_DestroyTexture(attached_texture);
		attached_texture = nullptr;
		video_buffer.Reset();
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
		return Napi::Number::New(env, SDL_InitSubSystem(SDL_INIT_VIDEO | SDL_INIT_EVENTS | SDL_INIT_TIMER));
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

		SDL_Window *window =
		    SDL_CreateWindow(title.c_str(), x, y, w * scale, h * scale, flags | SDL_WINDOW_ALLOW_HIGHDPI);
		if (window == NULL)
			return env.Undefined();
		return Napi::ArrayBuffer::New(env, window, sizeof(window));
	}

	Napi::Value get_window_flags(const Napi::CallbackInfo &info)
	{
		SDL_Window *window = static_cast<SDL_Window *>(get_ptr_from_js(info[0].As<Napi::ArrayBuffer>()));
		return Napi::Number::New(info.Env(), SDL_GetWindowFlags(window));
	}

	Napi::Value create_renderer(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		int index = info[1].As<Napi::Number>().Int64Value();
		Uint32 flags = info[2].As<Napi::Number>().Uint32Value();
		TTF_Init();
		SDL_Renderer *renderer = SDL_CreateRenderer(window, index, flags | SDL_RENDERER_ACCELERATED);
		if (renderer == NULL)
			return env.Undefined();
		int w, h;
		SDL_GetWindowSize(window, &w, &h);
		SDL_RenderSetLogicalSize(renderer, w / scale, h / scale);
		// Window backbuffers are invalid after SDL_RenderPresent. Keep the
		// canvas in a target texture so later drawing and filters retain it.
		SDL_Texture *main_target =
		    SDL_CreateTexture(renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, w / scale, h / scale);
		if (main_target == nullptr || SDL_SetRenderTarget(renderer, main_target) != 0)
		{
			Napi::Error::New(env, std::string("Cannot create canvas framebuffer: ") + SDL_GetError())
			    .ThrowAsJavaScriptException();
			SDL_DestroyTexture(main_target);
			SDL_DestroyRenderer(renderer);
			return env.Undefined();
		}
		main_targets[renderer] = main_target;
		SDL_SetTextureBlendMode(main_target, SDL_BLENDMODE_NONE);
		SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
		SDL_RenderClear(renderer);
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
		present_frame(renderer);
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
		return env.Undefined();
	}

	Napi::Value delete_texture(const Napi::CallbackInfo &info)
	{
		Napi::Env env = info.Env();
		SDL_Texture *texture = (SDL_Texture *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
		SDL_DestroyTexture(texture);
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
			delete[] pixels;
			throw Napi::Error::New(env, std::string("Cannot read data: ") + SDL_GetError());
		}
		return Napi::ArrayBuffer::New(env, (void *)pixels, size,
		                              [](Napi::Env, void *data)
		                              {
			                              delete[] static_cast<uint8_t *>(data);
		                              });
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
		std::string filename = info[0].As<Napi::String>().Utf8Value();
		int size = info[1].As<Napi::Number>().Int32Value();
		if (size <= 0)
		{
			Napi::RangeError::New(env, "Font size must be positive").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		auto key = std::make_pair(filename, size);
		auto entry = fonts.find(key);
		if (entry == fonts.end())
		{
			TTF_Font *font = TTF_OpenFont(filename.c_str(), size);
			if (!font)
			{
				Napi::Error::New(env, TTF_GetError()).ThrowAsJavaScriptException();
				return env.Undefined();
			}
			entry = fonts.emplace(key, font).first;
		}
		current_font = entry->second;
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
		SDL_Color color = {static_cast<Uint8>(info[2].As<Napi::Number>().Uint32Value()),
		                   static_cast<Uint8>(info[3].As<Napi::Number>().Uint32Value()),
		                   static_cast<Uint8>(info[4].As<Napi::Number>().Uint32Value()), 255};
		if (!current_font)
		{
			Napi::Error::New(env, "Load a font before drawing text").ThrowAsJavaScriptException();
			return env.Undefined();
		}
		if (info[1].As<Napi::String>().Utf8Value().empty())
			return env.Undefined();
		SDL_Surface *surface =
		    TTF_RenderUTF8_Solid(current_font, info[1].As<Napi::String>().Utf8Value().c_str(), color);

		if (!surface)
		{
			Napi::Error::New(env, TTF_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
		if (!texture)
		{
			SDL_FreeSurface(surface);
			Napi::Error::New(env, SDL_GetError()).ThrowAsJavaScriptException();
			return env.Undefined();
		}
		int texW = 0;
		int texH = 0;
		int x = info[5].As<Napi::Number>().Int32Value();
		int y = info[6].As<Napi::Number>().Int32Value();
		SDL_QueryTexture(texture, NULL, NULL, &texW, &texH);
		SDL_Rect dstrect = {x, y, texW, texH};
		SDL_RenderCopy(renderer, texture, NULL, &dstrect);
		SDL_FreeSurface(surface);
		SDL_DestroyTexture(texture);
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
