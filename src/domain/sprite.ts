// a sprite always has a width of 8 pixels
import type { Pixel } from "./graphics.ts";

export const SPRITE_WIDTH = 8
export type Position = { x: number, y: number }

export class Sprite {
    private readonly data: Uint8Array
    private readonly position: Position

    constructor(spriteData: Uint8Array, position: Position) {
        this.data = spriteData
        this.position = position
    }

    * [Symbol.iterator](): Generator<{ pixel: Pixel, position: Position }> {
        // iterate over each pixel with its position
        for (let line = 0; line < this.data.length; ++line) {
            for (let col = 0; col < SPRITE_WIDTH; ++col) {
                const pixel = this.extractPixel(line, col)
                yield {
                    pixel,
                    position: {
                        x: (this.position.x + col) % 64,
                        y: (this.position.y + line) % 32
                    },
                }
            }
        }
    }

    private extractPixel(line: number, col: number): Pixel {
        return this.data[line] & (0x80 >> col) ? 1 : 0
    }
}