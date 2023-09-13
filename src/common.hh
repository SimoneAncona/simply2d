#pragma once
#include <napi.h>

inline void *get_ptr_from_js(Napi::ArrayBuffer buffer)
{
    return (void *)buffer.Data();
}