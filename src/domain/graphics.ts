import { bitwiseXor } from "./binary-operations.ts";
import type { Position, Sprite } from "./sprite.ts";

export const DEAD_PIXEL = 0
export const ALIVE_PIXEL = 1
export type Pixel = 0 | 1

export const WIDTH = 64
export const HEIGHT = 32

export class Graphics {
    private readonly _pixels: Pixel[][]

    get pixels(): Pixel[][] {
        return this._pixels
    }

    constructor() {
        this._pixels = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => DEAD_PIXEL))
    }

    clearScreen() {
        this.fillScreen(DEAD_PIXEL)
    }

    fillScreen(pixel: Pixel) {
        this._pixels.forEach(line => line.fill(pixel))
    }

    drawSprite(sprite: Sprite, position: Position) {
        let spriteIsColliding = false

        for (const { pixel, offset } of sprite) {
            const finalPosition = {
                x: position.x + offset.x,
                y: position.y + offset.y
            }

            if (finalPosition.x >= WIDTH || finalPosition.y >= HEIGHT) {
                continue
            }

            const { pixelsAreColliding } = this.drawPixel(pixel, finalPosition)
            spriteIsColliding = spriteIsColliding || pixelsAreColliding
        }

        return { wasOverlapping: spriteIsColliding }
    }

    drawPixel(pixel: Pixel, { x, y }: Position) {
        const oldPixel = this.getPixelAt({ x, y })

        this._pixels[y][x] = this.mergePixels(this._pixels[y][x], pixel)

        return { pixelsAreColliding: oldPixel === ALIVE_PIXEL && pixel === ALIVE_PIXEL }
    }

    getPixelAt({ x, y }: Position): Pixel {
        return this._pixels[y][x]
    }

    mergePixels(oldPixel: Pixel, pixel: Pixel) {
        return bitwiseXor(oldPixel, pixel) as Pixel;
    }
}