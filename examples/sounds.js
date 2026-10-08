// Original synthesized effects: no external audio assets required.
export function toneWav(notes, noteSeconds = 0.09) {
    const rate = 22050, count = Math.round(notes.length * noteSeconds * rate);
    const wav = Buffer.alloc(44 + count * 2);
    wav.write("RIFF", 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
    wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36); wav.writeUInt32LE(count * 2, 40);
    for (let i = 0; i < count; i++) {
        const time = i / rate, note = Math.min(notes.length - 1, Math.floor(time / noteSeconds));
        const phase = time % noteSeconds / noteSeconds;
        const envelope = Math.min(1, phase * 25) * Math.pow(1 - phase, 1.5);
        wav.writeInt16LE(Math.round(Math.sin(2 * Math.PI * notes[note] * time) * envelope * 9000), 44 + i * 2);
    }
    return wav;
}
export function loadGameSounds(audio) {
    audio.loadSound("jump", toneWav([330, 440, 660], 0.045));
    audio.loadSound("coin", toneWav([988, 1319], 0.065));
    audio.loadSound("fall", toneWav([440, 330, 220, 110], 0.075));
    audio.loadSound("win", toneWav([523, 659, 784, 1047], 0.12));
}
