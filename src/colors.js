export var Colors = {
    BLACK: { red: 0, green: 0, blue: 0, alpha: 255 },
    WHITE: { red: 255, green: 255, blue: 255, alpha: 255 },
    RED: { red: 255, green: 0, blue: 0, alpha: 255 },
    GREEN: { red: 0, green: 255, blue: 0, alpha: 255 },
    BLUE: { red: 0, green: 0, blue: 255, alpha: 255 },
    YELLOW: { red: 255, green: 255, blue: 0, alpha: 255 },
    MAGENTA: { red: 255, green: 0, blue: 255, alpha: 255 },
    CYAN: { red: 0, green: 255, blue: 255, alpha: 255 },
    from8bit: function (color256) {
        return {
            red: (color256 >> 5) * 36,
            green: ((color256 & 28) >> 3) * 36,
            blue: color256 & 3,
            alpha: 255
        };
    }
};
