#include <stdint.h>
#include <emscripten/emscripten.h>

typedef void (*PixelFilter)(uint8_t* r, uint8_t* g, uint8_t* b);

void grayscale_filter(uint8_t* r, uint8_t* g, uint8_t* b) {
    uint8_t gray = (uint8_t)(*r * 0.3f + *g * 0.59f + *b * 0.11f);
    *r = gray;
    *g = gray;
    *b = gray;
}

void process_image(uint8_t* pixels, int num_pixels, PixelFilter filter) {
    for (int i = 0; i < num_pixels * 4; i += 4) {
        filter(&pixels[i], &pixels[i + 1], &pixels[i + 2]);
    }
}

EMSCRIPTEN_KEEPALIVE
void apply_grayscale(uint8_t* pixels, int num_pixels) {
    process_image(pixels, num_pixels, grayscale_filter);
}
