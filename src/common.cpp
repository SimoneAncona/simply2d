#include "common.hh"

void *get_ptr_from_js(Napi::ArrayBuffer buffer)
{
	return (void *)buffer.Data();
}