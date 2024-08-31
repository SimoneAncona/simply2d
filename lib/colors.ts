import { RGBAColor } from "./types.js"
export class Colors {
	static get BLACK() { return { red: 0, green: 0, blue: 0, alpha: 255 } as RGBAColor; }
	static get WHITE() { return { red: 255, green: 255, blue: 255, alpha: 255 } as RGBAColor; }
	static get RED() { return { red: 255, green: 0, blue: 0, alpha: 255 } as RGBAColor; }
	static get GREEN() { return { red: 0, green: 255, blue: 0, alpha: 255 } as RGBAColor; }
	static get BLUE() { return { red: 0, green: 0, blue: 255, alpha: 255 } as RGBAColor; }
	static get YELLOW() { return { red: 255, green: 255, blue: 0, alpha: 255 } as RGBAColor; }
	static get MAGENTA() { return { red: 255, green: 0, blue: 255, alpha: 255 } as RGBAColor; }
	static get CYAN() { return { red: 0, green: 255, blue: 255, alpha: 255 } as RGBAColor; }
	static get DARK_BLUE() { return { red: 0, green: 0, blue: 139, alpha: 255 } as RGBAColor; }
	static get NAVY() { return { red: 0, green: 0, blue: 128, alpha: 255 } as RGBAColor; }
	static get LIGHT_BLUE() { return { red: 173, green: 216, blue: 230, alpha: 255 } as RGBAColor; }
	static get TEAL() { return { red: 0, green: 128, blue: 128, alpha: 255 } as RGBAColor; }
	static get DARK_CYAN() { return { red: 0, green: 139, blue: 139, alpha: 255 } as RGBAColor; }
	static get PURPLE() { return { red: 128, green: 0, blue: 128, alpha: 255 } as RGBAColor; }
	static get PINK() { return { red: 255, green: 192, blue: 203, alpha: 255 } as RGBAColor; }
	static get GRAY() { return { red: 192, green: 192, blue: 192, alpha: 255 } as RGBAColor; }
	static get GREY() { return { red: 192, green: 192, blue: 192, alpha: 255 } as RGBAColor; }
	static get ORANGE() { return { red: 255, green: 165, blue: 0, alpha: 255 } as RGBAColor; }
	static get AQUAMARINE() { return { red: 127, green: 255, blue: 212, alpha: 255 } as RGBAColor; }
	static get OLIVE() { return { red: 128, green: 128, blue: 0, alpha: 255 } as RGBAColor; }
	static get DARK_RED() { return { red: 139, green: 0, blue: 0, alpha: 255 } as RGBAColor; }
	static get SALMON() { return { red: 250, green: 128, blue: 114, alpha: 255 } as RGBAColor; }
	static get TOMATO() { return { red: 255, green: 99, blue: 71, alpha: 255 } as RGBAColor; }
	static get GOLD() { return { red: 255, green: 215, blue: 0, alpha: 255 } as RGBAColor; }
	static get DARK_GREEN() { return { red: 0, green: 100, blue: 0, alpha: 255 } as RGBAColor; }
	static get INDIGO() { return { red: 75, green: 0, blue: 130, alpha: 255 } as RGBAColor; }
	static get TRANSPARENT() { return { red: 0, green: 0, blue: 0, alpha: 0 } as RGBAColor; }

	static from8bit(color256: number) {
		if (color256 < 0 || color256 >= 256) throw "Color256 must be between 0 and 255"
		return {
			red: (color256 >> 5) * 36,
			green: ((color256 & 0b00011100) >> 3) * 36,
			blue: (color256 & 0b00000011) * 85,
			alpha: 255
		} as RGBAColor
	}

	static from16bit(color: number) {
		if (color < 0 || color >= 65536) throw "Color must be between 0 and 65536";
		return {
			red: (color >> 11) * 8,
			green: ((color & 0b0000011111100000) >> 5) * 4,
			blue: (color & 0b0000000000011111) * 8,
			alpha: 255
		} as RGBAColor;
	}

	static from24bit(color: number) {
		if (color < 0 || color >= 2 ** 24) throw "Color must be between 0 and 2^24";
		return {
			red: (color >> 16),
			green: ((color & 0x00FF00) >> 8),
			blue: color & 0x0000FF,
			alpha: 255
		} as RGBAColor
	}

	static from32bit(color: number) {
		if (color < 0 || color >= 2 ** 32) throw "Color must be between 0 and 2^32";
		return {
			red: (color >> 24),
			green: ((color & 0x00FF0000) >> 16),
			blue: ((color & 0x0000FF00) >> 8),
			alpha: (color & 0xFF)
		} as RGBAColor
	}
}