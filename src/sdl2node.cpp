#include <napi.h>
#include <SDL2\SDL.h>

namespace SDL2binding
{

	Napi::Value sdl_init_n(const Napi::CallbackInfo& info)
	{
		Napi::Env env = info.Env();

		Uint32 flags = info[0].As<Napi::Number>().Uint32Value();

		Napi::Number returnValue = Napi::Number::New(env, SDL_Init(flags));
	}

	Napi::Object Init(Napi::Env env, Napi::Object exports)
	{
		exports.Set(Napi::String::New(env, "sdlInit"), Napi::Function::New<sdl_init_n>(env));
		return exports;
	}
}