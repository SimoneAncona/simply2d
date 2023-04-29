#include "sdl2node.hh"
#include "sdl2image_node.hh"

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	exports.Set(Napi::String::New(env, "init"), Napi::Function::New<SDL::init>(env));
	exports.Set(Napi::String::New(env, "getError"), Napi::Function::New<SDL::get_error>(env));
	exports.Set(Napi::String::New(env, "createWindow"), Napi::Function::New<SDL::create_window>(env));
	exports.Set(Napi::String::New(env, "createRenderer"), Napi::Function::New<SDL::create_renderer>(env));
	exports.Set(Napi::String::New(env, "showWindow"), Napi::Function::New<SDL::show_window>(env));
	exports.Set(Napi::String::New(env, "hideWindow"), Napi::Function::New<SDL::hide_window>(env));
	exports.Set(Napi::String::New(env, "setDrawColor"), Napi::Function::New<SDL::set_render_draw_color>(env));
	exports.Set(Napi::String::New(env, "renderPresent"), Napi::Function::New<SDL::render_present>(env));
	exports.Set(Napi::String::New(env, "delay"), Napi::Function::New<SDL::delay>(env));
	exports.Set(Napi::String::New(env, "drawPoint"), Napi::Function::New<SDL::render_draw_point>(env));
	exports.Set(Napi::String::New(env, "drawLine"), Napi::Function::New<SDL::render_draw_line>(env));
	exports.Set(Napi::String::New(env, "renderCopy"), Napi::Function::New<SDL::render_copy>(env));
	exports.Set(Napi::String::New(env, "drawRectangle"), Napi::Function::New<SDL::draw_rectangle>(env));
	exports.Set(Napi::String::New(env, "createTexture"), Napi::Function::New<SDL::create_texture>(env));
	exports.Set(Napi::String::New(env, "lockTexture"), Napi::Function::New<SDL::lock_texture>(env));
	exports.Set(Napi::String::New(env, "unlockTexture"), Napi::Function::New<SDL::unlock_texture>(env));

    exports.Set(Napi::String::New(env, "imgInit"), Napi::Function::New<SDLImage::init>(env));
    exports.Set(Napi::String::New(env, "loadTexture"), Napi::Function::New<SDLImage::load_texture>(env));
    exports.Set(Napi::String::New(env, "imgQuit"), Napi::Function::New<SDLImage::quit>(env));
	return exports;
}

NODE_API_MODULE(addon, Init);