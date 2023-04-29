#include <SDL.h>
#include <napi.h>
#include <string>

void *get_ptr_from_js(Napi::ArrayBuffer);
Napi::Value sdl_init(const Napi::CallbackInfo&);
Napi::Value sdl_get_error(const Napi::CallbackInfo&);
Napi::Value sdl_create_window(const Napi::CallbackInfo&); 
Napi::Value sdl_create_renderer(const Napi::CallbackInfo&);
Napi::Value sdl_show_window(const Napi::CallbackInfo&);
Napi::Value sdl_hide_window(const Napi::CallbackInfo&);
Napi::Value sdl_set_render_draw_color(const Napi::CallbackInfo&);
Napi::Value sdl_render_clear(const Napi::CallbackInfo&);
Napi::Value sdl_render_present(const Napi::CallbackInfo&);
Napi::Value sdl_delay(const Napi::CallbackInfo&);
Napi::Value sdl_render_draw_point(const Napi::CallbackInfo&);
Napi::Value sdl_render_draw_line(const Napi::CallbackInfo&);