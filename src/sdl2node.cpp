#include <napi.h>
#include <SDL.h>
#include <string>

void* get_value_from_ptr(Napi::ArrayBuffer& buffer)
{
	return (void*)((uint64_t*)buffer.Data());
}

Napi::Value sdl_init(const Napi::CallbackInfo& info)
{
	Napi::Env env = info.Env();
	Uint32 flags = info[0].As<Napi::Number>().Uint32Value();
	return Napi::Number::New(env, SDL_Init(flags));
}

Napi::Value sdl_get_error(const Napi::CallbackInfo& info)
{
	Napi::Env env = info.Env();
	return Napi::String::New(env, SDL_GetError());
}

Napi::Value sdl_create_window(const Napi::CallbackInfo& info)
{
	Napi::Env env = info.Env();
	std::string title = info[0].As<Napi::String>().Utf8Value();
	int x = info[1].As<Napi::Number>().Int64Value();
	int y = info[2].As<Napi::Number>().Int64Value();
	int w = info[3].As<Napi::Number>().Int64Value();
	int h = info[4].As<Napi::Number>().Int64Value();
	Uint32 flags = info[5].As<Napi::Number>().Uint32Value();
	SDL_Window *window = SDL_CreateWindow(title.c_str(), x, y, w, h, flags);
	return Napi::ArrayBuffer::New(env, window, sizeof(window));
}

Napi::Value sdl_create_renderer(const Napi::CallbackInfo& info)
{
	Napi::Env env = info.Env();
	SDL_Window *window = (SDL_Window*) get_value_from_ptr(info[0].As<Napi::ArrayBuffer>());
	int index = info[1].As<Napi::Number>().Int64Value();
	Uint32 flags = info[2].As<Napi::Number>().Uint32Value();
	SDL_Renderer *renderer = SDL_CreateRenderer(window, index, flags);
	return Napi::ArrayBuffer::New(env, renderer, sizeof(renderer));
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	exports.Set(Napi::String::New(env, "init"), Napi::Function::New<sdl_init>(env));
	exports.Set(Napi::String::New(env, "getError"), Napi::Function::New<sdl_get_error>(env));
	exports.Set(Napi::String::New(env, "createWindow"), Napi::Function::New<sdl_create_window>(env));
	exports.Set(Napi::String::New(env, "createRenderer"), Napi::Function::New<sdl_create_renderer>(env));
	return exports;
}

NODE_API_MODULE(addon, Init);