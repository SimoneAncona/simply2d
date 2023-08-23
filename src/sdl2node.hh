#pragma once
#include <SDL.h>
#include <SDL_ttf.h>
#include <napi.h>
#include <string>
#include <vector>
#include <cmath>
#include "common.hh"

namespace SDL
{
	struct Position
	{
		int x, y;
	};
	Napi::Value init(const Napi::CallbackInfo &);
	Napi::Value get_error(const Napi::CallbackInfo &);
	Napi::Value create_window(const Napi::CallbackInfo &);
	Napi::Value create_renderer(const Napi::CallbackInfo &);
	Napi::Value show_window(const Napi::CallbackInfo &);
	Napi::Value hide_window(const Napi::CallbackInfo &);
	Napi::Value set_render_draw_color(const Napi::CallbackInfo &);
	Napi::Value render_clear(const Napi::CallbackInfo &);
	Napi::Value render_present(const Napi::CallbackInfo &);
	Napi::Value delay(const Napi::CallbackInfo &);
	Napi::Value render_draw_point(const Napi::CallbackInfo &);
	Napi::Value render_draw_line(const Napi::CallbackInfo &);
	Napi::Value render_copy(const Napi::CallbackInfo &);
	Napi::Value draw_rectangle(const Napi::CallbackInfo &);
	Napi::Value create_texture(const Napi::CallbackInfo &);
	Napi::Value write_texture(const Napi::CallbackInfo &);
	Napi::Value read_render(const Napi::CallbackInfo &);
	Napi::Value set_scale(const Napi::CallbackInfo &);
	Napi::Value on_click(const Napi::CallbackInfo &);
	Napi::Value on_keydown(const Napi::CallbackInfo &);
	Napi::Value on_keyup(const Napi::CallbackInfo &);
	Napi::Value on_keysdown(const Napi::CallbackInfo &);
	Napi::Value on_keysup(const Napi::CallbackInfo &);
	Napi::Value get_ticks(const Napi::CallbackInfo &);
	Napi::Value set_antialias(const Napi::CallbackInfo &);
	Napi::Value set_font(const Napi::CallbackInfo &);
	Napi::Value get_screen_resolution(const Napi::CallbackInfo &info);
	Napi::Value draw_text(const Napi::CallbackInfo &);
	Napi::Value draw_arc(const Napi::CallbackInfo &);
	inline void handle_events(Napi::Env);
	Position from_angle(int, int, float, int);
}