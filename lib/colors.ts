import { RGBAColor } from "./types.js"
export const Colors = {
	BLACK: { red: 0, green: 0, blue: 0, alpha: 255 } as RGBAColor,
	WHITE: { red: 255, green: 255, blue: 255, alpha: 255 } as RGBAColor,
	RED: { red: 255, green: 0, blue: 0, alpha: 255 } as RGBAColor,
	GREEN: { red: 0, green: 255, blue: 0, alpha: 255 } as RGBAColor,
	BLUE: { red: 0, green: 0, blue: 255, alpha: 255 } as RGBAColor,
	YELLOW: { red: 255, green: 255, blue: 0, alpha: 255 } as RGBAColor,
	MAGENTA: { red: 255, green: 0, blue: 255, alpha: 255 } as RGBAColor,
	CYAN: { red: 0, green: 255, blue: 255, alpha: 255 } as RGBAColor,
	DARK_BLUE: { red: 0, green: 0, blue: 139, alpha: 255 } as RGBAColor,
	LIGHT_BLUE: { red: 173, green: 216, blue: 230, alpha: 255 } as RGBAColor,
	PURPLE: { red: 128, green: 0, blue: 128, alpha: 255 } as RGBAColor,
	PINK: { red: 255, green: 192, blue: 203, alpha: 255 } as RGBAColor,
	GRAY: { red: 192, green: 192, blue: 192, alpha: 255 } as RGBAColor,
	GREY: { red: 192, green: 192, blue: 192, alpha: 255 } as RGBAColor,
	ORANGE: { red: 255, green: 165, blue: 0, alpha: 255 } as RGBAColor,
	AQUAMARINE: { red: 127, green: 255, blue: 212, alpha: 255 } as RGBAColor,
	TRANSPARENT: { red: 0, green: 0, blue: 0, alpha: 0 } as RGBAColor,

	from8bit(color256: number) {
		if (color256 < 0 || color256 >= 256) throw "Color256 must be between 0 and 255"
		return {
			red: (color256 >> 5) * 36,
			green: ((color256 & 0b00011100) >> 3) * 36,
			blue: (color256 & 0b00000011) * 85,
			alpha: 255
		} as RGBAColor
	},

	from16bit(color: number) {
		if (color < 0 || color >= 65536) throw "Color must be between 0 and 65536";
		return {
			red: (color >> 11) * 8,
			green: ((color & 0b0000011111100000) >> 5) * 4,
			blue: (color & 0b0000000000011111) * 8,
			alpha: 255
		} as RGBAColor;
	},

	from24bit(color: number) {
		if (color < 0 || color >= 2**24) throw "Color must be between 0 and 2^24";
		return {
			red: (color >> 16),
			green: ((color & 0x00FF00) >> 8),
			blue: color & 0x0000FF,
			alpha: 255
		} as RGBAColor
	},

	from32bit(color: number) {
		if (color < 0 || color >= 2**32) throw "Color must be between 0 and 2^32";
		return {
			red: (color >> 24),
			green: ((color & 0x00FF0000) >> 16),
			blue: ((color & 0x0000FF00) >> 8),
			alpha: (color & 0xFF)
		} as RGBAColor
	}
}