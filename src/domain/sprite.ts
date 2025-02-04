// a sprite always has a width of 8 pixels
import type { Pixel } from "./graphics.ts";

export const SPRITE_WIDTH = 8
export type Position = { x: number, y: number }

export class Sprite {
    private readonly data: Uint8Array

    constructor(spriteData: Uint8Array) {
        this.data = spriteData
    }

    * [Symbol.iterator](): Generator<{ pixel: Pixel, offset: Position }> {
        // iterate over each pixel with its position
        for (let line = 0; line < this.data.length; ++line) {
            for (let col = 0; col < SPRITE_WIDTH; ++col) {
                const pixel = this.extractPixel(line, col)

                yield {
                    pixel,
                    offset: {
                        x: col,
                        y: line
                    },
                }
            }
        }
    }

    // TODO: make more readable
    public extractPixel(line: number, col: number): Pixel {
        return (this.data[line] & (0x80 >> col)) ? 1 : 0
    }
}