import assert from "node:assert/strict";

// Offscreen video keeps the Linux smoke test independent of a desktop session.
if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
process.env.SDL_AUDIODRIVER ??= "dummy";
const { Canvas, Colors, PixelFormats } = await import("../index.js");
const { sdl2bind } = await import("../lib/sdl2int.js");

for (const scale of [1, 2]) {
    const canvas = new Canvas("Filter smoke test", 3, 2, 0, 0, {
        mode: "hidden", scale, antiAliasing: false
    });
    try {
        canvas.setBackgroundColor(Colors.RED);
        const rgba = new Uint8Array(3 * 2 * 4);
        canvas.attach(rgba, PixelFormats.rgba8888);
        assert.deepEqual(Array.from(new Uint32Array(rgba.buffer)), Array(6).fill(0xff0000ff));
        assert.throws(() => canvas.applyFilter(v => v), /Detach/);
        canvas.detach();

        // Detaching must commit edits made before the interval gets another turn.
        for (const format of [8, 16, 24, 32]) {
            const pending = new Uint8Array(3 * 2 * format / 8);
            canvas.attach(pending, format);
            pending.fill(255);
            canvas.detach();
            canvas.attach(pending, format);
            assert.ok(pending.every(value => value === 255), `detach must commit ${format}-bit pixels`);
            canvas.detach();
            canvas.detach(); // Repeated detachment is harmless.
        }
        canvas.setBackgroundColor(Colors.RED);

        const live = new Uint8Array(3 * 2);
        canvas.attach(live, PixelFormats.rgb332);
        live.fill(255);
        await new Promise(resolve => setTimeout(resolve, 30));
        assert.ok(canvas._isAttachedMode);
        assert.ok(new Uint32Array(canvas.getRawData().buffer).every(value => value === 0xffffffff));
        canvas.resize(3, 2); canvas.pollEvents();
        assert.ok(canvas._isAttachedMode, "An unchanged size must not detach the buffer");
        canvas.resize(4, 3); canvas.pollEvents();
        assert.equal(canvas._isAttachedMode, false);
        assert.equal(canvas.width, 4);
        const resized = new Uint32Array(canvas.getRawData().buffer);
        assert.equal(resized[0], 0xffffffff);
        assert.equal(resized[3], 0x000000ff, "Resizing must not stretch the attached buffer");
        canvas.resize(3, 2); canvas.pollEvents();
        canvas.setBackgroundColor(Colors.RED);

        // Identity filtering must retain the background and line after presentation.
        canvas.drawLine(Colors.WHITE, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
        canvas.attach(rgba, PixelFormats.rgba8888);
        const original = rgba.slice();
        assert.ok(new Uint32Array(original.buffer).includes(0xffffffff));
        assert.ok(new Uint32Array(original.buffer).includes(0xff0000ff));
        canvas.detach();
        canvas.applyFilter(value => value);
        canvas.attach(rgba, PixelFormats.rgba8888);
        assert.deepEqual(rgba, original);
        canvas.detach();

        let calls = 0;
        canvas.applyFilter((value, index, buffer) => {
            assert.equal(index, calls++);
            assert.equal(buffer.length, rgba.length);
            return 255;
        });
        assert.equal(calls, rgba.length);
        canvas.attach(rgba, PixelFormats.rgba8888);
        assert.ok(rgba.every(value => value === 255));
        canvas.detach();
        assert.throws(() => canvas.applyFilter(() => { throw new Error("filter failed"); }), /filter failed/);

        // An odd width exercises padding in 24-bit texture rows.
        canvas.setBackgroundColor(Colors.RED);
        const rgb = new Uint8Array(3 * 2 * 3);
        canvas.attach(rgb, PixelFormats.rgb888);
        assert.deepEqual(Array.from(rgb), Array(6).fill([255, 0, 0]).flat());
        rgb.set(Array(6).fill([0, 0, 255]).flat());
        sdl2bind.update(canvas._renderer);
        canvas.detach();
        canvas.attach(rgb, PixelFormats.rgb888);
        assert.deepEqual(Array.from(rgb), Array(6).fill([0, 0, 255]).flat());
        canvas.detach();
    } finally {
        canvas.close();
    }
}
console.log("Framebuffer and filter smoke tests passed.");
