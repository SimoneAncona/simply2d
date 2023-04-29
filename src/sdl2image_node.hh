#pragma once
#include <napi.h>
#include <SDL_image.h>
#include "common.hh"

namespace SDLImage
{
    Napi::Value init(const Napi::CallbackInfo&);
    Napi::Value loadTexture(const Napi::CallbackInfo&);
    Napi::Value quit(const Napi::CallbackInfo&);
}