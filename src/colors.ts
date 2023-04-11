import { RGBAColor } from "./types"
export const Colors = {
	BLACK: { red: 0, green: 0, blue: 0, alpha: 255 } as RGBAColor,
	WHITE: { red: 255, green: 255, blue: 255, alpha: 255 } as RGBAColor,
	RED: { red: 255, green: 0, blue: 0, alpha: 255 } as RGBAColor,
	GREEN: { red: 0, green: 255, blue: 0, alpha: 255 } as RGBAColor,
	BLUE: { red: 0, green: 0, blue: 255, alpha: 255 } as RGBAColor,
	YELLOW: { red: 255, green: 255, blue: 0, alpha: 255 } as RGBAColor,
	MAGENTA: { red: 255, green: 0, blue: 255, alpha: 255 } as RGBAColor,
	CYAN: { red: 0, green: 255, blue: 255, alpha: 255 } as RGBAColor,

	from8bit(color256: number) {
		return {
			red: (color256 >> 5) * 36,
			green: ((color256 & 0b00011100) >> 3) * 36,
			blue: color256 & 0b00000011,
			alpha: 255
		} as RGBAColor
	}
}