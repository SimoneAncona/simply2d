#include "sdl2node.hh"

Napi::Value init(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	Uint32 flags = info[0].As<Napi::Number>().Uint32Value();
	return Napi::Number::New(env, SDL_Init(flags));
}

Napi::Value get_error(const Napi::CallbackInfo &info)
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
	SDL_Window *window = SDL_CreateWindow(title.c_str(), x, y, w, h, flags);
	if (window == NULL) return env.Undefined();
	return Napi::ArrayBuffer::New(env, window, sizeof(window));
}

Napi::Value create_renderer(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Window *window = (SDL_Window *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int index = info[1].As<Napi::Number>().Int64Value();
	Uint32 flags = info[2].As<Napi::Number>().Uint32Value();
	SDL_Renderer *renderer = SDL_CreateRenderer(window, index, flags);
	if (renderer == NULL) return env.Undefined();
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
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int red = info[0].As<Napi::Number>().Int64Value();
	int green = info[1].As<Napi::Number>().Int64Value();
	int blue = info[2].As<Napi::Number>().Int64Value();
	int alpha = info[3].As<Napi::Number>().Int64Value();
	return Napi::Number::New(env, SDL_SetRenderDrawColor(renderer, red, green, blue, alpha));
}

Napi::Value render_clear(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	return Napi::Number::New(env, SDL_RenderClear(renderer));
}

Napi::Value render_present(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	SDL_RenderPresent(renderer);
	return env.Undefined();
}

Napi::Value delay(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	int ms = info[0].As<Napi::Number>().Int64Value();
	SDL_Delay(ms);
	return env.Undefined();
}

Napi::Value render_draw_point(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer*)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int px = info[1].As<Napi::Number>().Int64Value();
	int py = info[2].As<Napi::Number>().Int64Value();
	return Napi::Number::New(env, SDL_RenderDrawPoint(renderer, px, py));
}

Napi::Value render_draw_line(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SDL_Renderer *renderer = (SDL_Renderer*)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>());
	int x1 = info[1].As<Napi::Number>().Int64Value();
	int y1 = info[2].As<Napi::Number>().Int64Value();
	int x2 = info[3].As<Napi::Number>().Int64Value();
	int y2 = info[4].As<Napi::Number>().Int64Value();
	return Napi::Number::New(env, SDL_RenderDrawLine(renderer, x1, y1, x2, y2));
}

