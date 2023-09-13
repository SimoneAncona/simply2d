#pragma once
#include <napi.h>

#define GET_RENDERER (SDL_Renderer *)get_ptr_from_js(info[0].As<Napi::ArrayBuffer>())

inline void *get_ptr_from_js(Napi::ArrayBuffer buffer)
{
    return (void *)buffer.Data();
}