#include <SDL.h>
#include <utility>
#if _DEBUG
    #include <iostream>
#endif

namespace AA
{
    inline float fpart(float f)
    {
        if (f > 0) return f - (int)f;
        return f - ((int)f + 1);
    }

    void draw_line_aa(SDL_Renderer *renderer, int x0, int y0, int x1, int y1)
    {
        bool steep = abs(y1 - y0) > abs(x1 - x0);

        if (steep)
        {
            std::swap(x0, y0);
            std::swap(x1, y1);
        }
        if (x0 > x1)
        {
            std::swap(x0, x1);
            std::swap(y0, y1);
        }

        float dx = x1 - x0;
        float dy = y1 - y0;
        float gradient = dy / dx;
        if (dx == 0.0)
            gradient = 1;

        float intersectY = y0;

        if (steep)
        {
            for (int x = x0; x <= x1; x += 1)
            {
                Uint8 r, g, b, a;
                float bright = fpart(intersectY);
                float inv_bright = 1 - bright;
                SDL_GetRenderDrawColor(renderer, &r, &g, &b, &a);
                SDL_SetRenderDrawColor(renderer, r, g, b, 255 * bright);
                SDL_RenderDrawPoint(renderer, floor(intersectY), x);
                SDL_SetRenderDrawColor(renderer, r, g, b, 255 * inv_bright);
                SDL_RenderDrawPoint(renderer, floor(intersectY) + 1, x);
                intersectY += gradient;
            }
        }
        else
        {
            for (int x = x0; x <= x1; x += 1)
            {
                Uint8 r, g, b, a;
                float bright = fpart(intersectY);
                float inv_bright = 1 - bright;
                SDL_GetRenderDrawColor(renderer, &r, &g, &b, &a);
                SDL_SetRenderDrawColor(renderer, r, g, b, 255 * bright);
                SDL_RenderDrawPoint(renderer, x, floor(intersectY));
                SDL_SetRenderDrawColor(renderer, r, g, b, 255 * inv_bright);
                SDL_RenderDrawPoint(renderer, x, floor(intersectY) - 1);
                intersectY += gradient;
            }
        }
    }   
}