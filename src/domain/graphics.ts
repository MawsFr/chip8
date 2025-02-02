import { bitwiseXor } from "./binary-operations.ts";
import type { Position, Sprite } from "./sprite.ts";

export const DEAD_PIXEL = 0
export const ALIVE_PIXEL = 1
export type Pixel = 0 | 1

export class Graphics {
    private readonly _pixels: Pixel[][]

    get pixels(): Pixel[][] {
        return this._pixels
    }

    constructor() {
        this._pixels = Array.from({ length: 32 }, () => Array.from({ length: 64 }, () => DEAD_PIXEL))
    }

    getPixelAt({ x, y }: Position): Pixel {
        return this._pixels[y][x]
    }

    drawPixel(pixel: Pixel, { x, y }: Position) {
        const oldPixel = this.getPixelAt({ x, y })

        this._pixels[y][x] = this.mergePixels(this._pixels[y][x], pixel)

        return { wasAlive: oldPixel === ALIVE_PIXEL }
    }

    mergePixels(oldPixel: Pixel, pixel: Pixel) {
        return bitwiseXor(oldPixel, pixel) as Pixel;
    }

    clearScreen() {
        this.fillScreen(DEAD_PIXEL)
    }

    fillScreen(pixel: Pixel) {
        this._pixels.forEach(line => line.fill(pixel))
    }

    drawSprite(sprite: Sprite) {
        let wasOverlapping = false

        for (const { position, pixel } of sprite) {
            const { wasAlive } = this.drawPixel(pixel, position)
            wasOverlapping = wasOverlapping || wasAlive
        }

        return { wasOverlapping }
    }
}