// Small platforming model for the Mario example, in logical canvas pixels.
export const TILE = 16;
export const WORLD_WIDTH = 1344;
export const FLOOR = 144;
export const FLAG_X = 1272;
export const platforms = [
    { x: 0, y: FLOOR, width: 272, height: 48, tile: 0 },
    { x: 304, y: FLOOR, width: 368, height: 48, tile: 0 },
    { x: 720, y: FLOOR, width: 304, height: 48, tile: 0 },
    { x: 1072, y: FLOOR, width: 272, height: 48, tile: 0 },
    { x: 96, y: 112, width: 48, height: 16, tile: 1 },
    { x: 176, y: 80, width: 48, height: 16, tile: 1 },
    { x: 384, y: 112, width: 64, height: 16, tile: 1 },
    { x: 464, y: 80, width: 48, height: 16, tile: 1 },
    { x: 560, y: 112, width: 48, height: 16, tile: 1 },
    { x: 784, y: 112, width: 48, height: 16, tile: 1 },
    { x: 864, y: 80, width: 64, height: 16, tile: 1 },
    { x: 976, y: 112, width: 32, height: 16, tile: 1 },
    { x: 1152, y: 128, width: 16, height: 16, tile: 3 },
    { x: 1168, y: 112, width: 16, height: 32, tile: 3 },
    { x: 1184, y: 96, width: 16, height: 48, tile: 3 }
];
const coinPositions = [[72, 124], [112, 96], [128, 96], [192, 64], [208, 64], [336, 124], [400, 96],
    [432, 96], [480, 64], [496, 64], [576, 96], [752, 124], [800, 96], [880, 64], [912, 64], [992, 96], [1120, 124], [1200, 76]];
const checkpoints = [40, 320, 736, 1088];
const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
const approach = (value, target, amount) => value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);

export class MarioWorld {
    constructor() { this.restart(); }
    restart() {
        this.coins = coinPositions.map(([x, y]) => ({ x, y, collected: false }));
        this.score = 0; this.deaths = 0; this.won = false; this.elapsed = 0; this.checkpoint = 0;
        this.respawn();
    }
    respawn() {
        this.player = { x: checkpoints[this.checkpoint], y: FLOOR - 16, width: 12, height: 16, vx: 0, vy: 0, grounded: true, facingLeft: false };
        this.jumpBuffer = 0; this.coyoteTime = 0; this.accumulator = 0;
    }
    jump() { this.jumpBuffer = 0.12; }
    releaseJump() { if (this.player.vy < -120) this.player.vy = -120; }
    update(deltaSeconds, input = {}) {
        if (this.won) return;
        this.accumulator += Math.min(deltaSeconds, 0.1);
        const step = 1 / 120;
        while (this.accumulator >= step) {
            this.accumulator -= step;
            this.step(step, input);
            if (this.won) break;
        }
    }
    step(dt, input) {
        this.elapsed += dt;
        const player = this.player;
        const direction = Number(!!input.right) - Number(!!input.left);
        if (direction) player.facingLeft = direction < 0;
        player.vx = approach(player.vx, direction * (input.run ? 145 : 100), (direction ? 900 : 1200) * dt);
        this.coyoteTime = player.grounded ? 0.09 : Math.max(0, this.coyoteTime - dt);
        this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
        if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
            player.vy = -290; player.grounded = false; this.jumpBuffer = 0; this.coyoteTime = 0;
        }
        player.x += player.vx * dt;
        for (const platform of platforms) if (overlaps(player, platform)) {
            player.x = player.vx > 0 ? platform.x - player.width : platform.x + platform.width;
            player.vx = 0;
        }
        player.x = Math.max(0, Math.min(WORLD_WIDTH - player.width, player.x));
        player.vy = Math.min(600, player.vy + 950 * dt);
        player.y += player.vy * dt;
        player.grounded = false;
        for (const platform of platforms) if (overlaps(player, platform)) {
            if (player.vy >= 0) { player.y = platform.y - player.height; player.grounded = true; }
            else player.y = platform.y + platform.height;
            player.vy = 0;
        }
        for (const coin of this.coins) if (!coin.collected && overlaps(player, { x: coin.x - 5, y: coin.y - 6, width: 10, height: 12 })) {
            coin.collected = true; this.score += 100;
        }
        if (player.grounded) for (let i = this.checkpoint + 1; i < checkpoints.length; i++) {
            if (player.x >= checkpoints[i]) this.checkpoint = i;
        }
        if (player.y > 224) { this.deaths++; this.respawn(); }
        else if (player.x + player.width >= FLAG_X && player.grounded) { this.won = true; this.score += 1000; }
    }
}
