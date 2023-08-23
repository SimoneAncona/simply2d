#pragma once
#include <napi.h>
#include <SDL_image.h>
#include "common.hh"

namespace SDLImage
{
	Napi::Value init(const Napi::CallbackInfo&);
	Napi::Value load_texture(const Napi::CallbackInfo&);
	Napi::Value save_jpg(const Napi::CallbackInfo&);
	Napi::Value save_png(const Napi::CallbackInfo&);
	Napi::Value quit(const Napi::CallbackInfo &);
	Napi::Value draw_texture(const Napi::CallbackInfo &);
	Napi::Value get_texture_res(const Napi::CallbackInfo &);
}