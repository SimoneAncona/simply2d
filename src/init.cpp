#include <napi.h>
#include "sdl2node.hh"
#include "sdl2image_node.hh"

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	exports.Set(Napi::String::New(env, "init"), Napi::Function::New<sdl_init>(env));
	exports.Set(Napi::String::New(env, "getError"), Napi::Function::New<sdl_get_error>(env));
	exports.Set(Napi::String::New(env, "createWindow"), Napi::Function::New<sdl_create_window>(env));
	exports.Set(Napi::String::New(env, "createRenderer"), Napi::Function::New<sdl_create_renderer>(env));
	exports.Set(Napi::String::New(env, "showWindow"), Napi::Function::New<sdl_show_window>(env));
	exports.Set(Napi::String::New(env, "hideWindow"), Napi::Function::New<sdl_hide_window>(env));
	exports.Set(Napi::String::New(env, "setDrawColor"), Napi::Function::New<sdl_set_render_draw_color>(env));
	exports.Set(Napi::String::New(env, "renderPresent"), Napi::Function::New<sdl_render_present>(env));
	exports.Set(Napi::String::New(env, "delay"), Napi::Function::New<sdl_delay>(env));
	exports.Set(Napi::String::New(env, "drawPoint"), Napi::Function::New<sdl_render_draw_point>(env));
	exports.Set(Napi::String::New(env, "drawLine"), Napi::Function::New<sdl_render_draw_line>(env));
	return exports;
}

NODE_API_MODULE(addon, Init);