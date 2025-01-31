import { xor } from "./binary-operations.ts";
import type { Position, Sprite } from "./sprite.ts";

export const DEAD_PIXEL = 0
export const ALIVE_PIXEL = 1
export type Pixel = 0 | 1

export class Graphics {
    public pixels: Pixel[][]

    constructor() {
        this.pixels = Array.from({ length: 32 }, () => Array.from({ length: 64 }, () => DEAD_PIXEL))
    }

    getPixelAt({ x, y }: Position): Pixel {
        return this.pixels[y][x]
    }

    drawPixel(pixel: Pixel, { x, y }: Position) {
        const oldPixel = this.getPixelAt({ x, y })

        this.pixels[y][x] = this.mergePixels(this.pixels[y][x], pixel)

        return { wasAlive: oldPixel === ALIVE_PIXEL }
    }

    mergePixels(oldPixel: Pixel, pixel: Pixel) {
        return xor(oldPixel, pixel) as Pixel;
    }

    clearScreen() {
        this.fillScreen(DEAD_PIXEL)
    }

    fillScreen(pixel: Pixel) {
        this.pixels.forEach(line => line.fill(pixel))
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