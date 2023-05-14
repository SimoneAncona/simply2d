#include "sdl2node.hh"

Napi::Value SDL::init(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	Uint32 flags = info[0].As<Napi::Number>().Uint32Value();
	return Napi::Number::New(env, SDL_Init(flags));
	SDL_Event pingStop;
	while (SDL_PollEvent(&pingStop))
	{
	}
}

Napi::Value SDL::get_error(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	return Napi::String::New(env, SDL_GetError());
}

Napi::Value SDL::create_window(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string title = info[0].As<Napi::String>().Utf8Value();
	int x = info[1].As<Napi::Number>().Int64Value();
	int y = info[2].As<Napi::Number>().Int64Value();
	int w = info[3].As<Napi::Number>().Int64Value();
	int h = info[4].As<Napi::Number>().Int64Value();
	Uint32 flags = info[5].As<Napi::Number>().Uint32Value();
	SDL_Window *window = SDL_CreateWindow(title.c_str(), x, y, w, h, flags);
	if (window == NULL)
		return env.Undefined();
	return Napi::ArrayBuffer::New(env, window, sizeof(window));
}

Napi::Value SDL::create_renderer(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int index = info[1].As<Napi::Number>().Int64Value();
	Uint32 flags = info[2].As<Napi::Number>().Uint32Value();
	SDL_Renderer *renderer = SDL_CreateRenderer(window, index, flags);
	if (renderer == NULL)
		return env.Undefined();
	return Napi::ArrayBuffer::New(env, renderer, sizeof(renderer));
}

Napi::Value SDL::show_window(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	SDL_ShowWindow(window);
	return env.Undefined();
}

Napi::Value SDL::hide_window(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	SDL_HideWindow(window);
	return env.Undefined();
}

Napi::Value SDL::set_render_draw_color(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int red = info[1].As<Napi::Number>().Int64Value();
	int green = info[2].As<Napi::Number>().Int64Value();
	int blue = info[3].As<Napi::Number>().Int64Value();
	int alpha = info[4].As<Napi::Number>().Int64Value();
	return Napi::Number::New(env, SDL_SetRenderDrawColor(renderer, red, green, blue, alpha));
}

Napi::Value SDL::render_clear(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	return Napi::Number::New(env, SDL_RenderClear(renderer));
}

Napi::Value SDL::render_present(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	SDL_RenderPresent(renderer);
	return env.Undefined();
}

Napi::Value SDL::delay(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	int ms = info[0].As<Napi::Number>().Int64Value();
	SDL_Delay(ms);
	return env.Undefined();
}

Napi::Value SDL::render_draw_point(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int px = info[1].As<Napi::Number>().Int64Value();
	int py = info[2].As<Napi::Number>().Int64Value();
	return Napi::Number::New(env, SDL_RenderDrawPoint(renderer, px, py));
}

Napi::Value SDL::render_draw_line(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int x1 = info[1].As<Napi::Number>().Int64Value();
	int y1 = info[2].As<Napi::Number>().Int64Value();
	int x2 = info[3].As<Napi::Number>().Int64Value();
	int y2 = info[4].As<Napi::Number>().Int64Value();
	return Napi::Number::New(env, SDL_RenderDrawLine(renderer, x1, y1, x2, y2));
}

Napi::Value SDL::render_copy(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	SDL_Texture *texture = (SDL_Texture *)get_ptr_from_js(info[1].As<Napi::ArrayBuffer>());
	SDL_Rect *src = (SDL_Rect *)get_ptr_from_js(info[2].As<Napi::ArrayBuffer>());
	SDL_Rect *dest = (SDL_Rect *)get_ptr_from_js(info[3].As<Napi::ArrayBuffer>());
	return Napi::Number::New(env, SDL_RenderCopy(renderer, texture, NULL, NULL));
}

Napi::Value SDL::draw_rectangle(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int x = info[1].As<Napi::Number>().Int64Value();
	int y = info[2].As<Napi::Number>().Int64Value();
	int w = info[3].As<Napi::Number>().Int64Value();
	int h = info[4].As<Napi::Number>().Int64Value();
	SDL_Rect rect;
	rect.x = x;
	rect.y = y;
	rect.w = w;
	rect.h = h;
	return Napi::Number::New(env, SDL_RenderDrawRect(renderer, &rect));
}

Napi::Value SDL::create_texture(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	Uint32 flags = info[1].As<Napi::Number>().Uint32Value();
	int access = info[2].As<Napi::Number>().Int64Value();
	int w = info[3].As<Napi::Number>().Int64Value();
	int h = info[4].As<Napi::Number>().Int64Value();
	SDL_Texture *texture = SDL_CreateTexture(renderer, flags, access, w, h);
	return Napi::ArrayBuffer::New(env, texture, sizeof(texture));
}

Napi::Value SDL::write_texture(const Napi::CallbackInfo &info)
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

Napi::Value SDL::read_render(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int width = info[1].As<Napi::Number>().Int64Value();
	int height = info[2].As<Napi::Number>().Int64Value();
	size_t size = width * height;
	uint8_t *pixels = new uint8_t[size];
	if (SDL_RenderReadPixels(renderer, NULL, SDL_PIXELFORMAT_RGB332, (void *)pixels, width) != 0)
	{
		throw Napi::Error::New(env, std::string("Cannot read data: ") + SDL_GetError());
	}
	return Napi::ArrayBuffer::New(env, (void *)pixels, size);
}

Napi::Value SDL::set_scale(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int width = info[1].As<Napi::Number>().Int64Value();
	int height = info[2].As<Napi::Number>().Int64Value();
	int scale = info[3].As<Napi::Number>().Int64Value();
	if (SDL_RenderSetLogicalSize(renderer, width * scale, height * scale) != 0)
	{
		throw Napi::Error::New(env, std::string("Cannot set the render scale: ") + SDL_GetError());
	}
	return env.Undefined();
}