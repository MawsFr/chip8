import type { Pixel } from "./graphics.ts";
import { isBitSet } from "./binary-operations.ts";

export const SPRITE_WIDTH = 8
export type Position = { x: number, y: number }
export type LineData = number

export class Sprite {
    private readonly data: Uint8Array

    constructor(spriteData: Uint8Array) {
        this.data = spriteData
    }

    * [Symbol.iterator](): Generator<{ pixel: Pixel, offset: Position }> {
        for (const [ line, lineData ] of this.data.entries()) {
            for (let col = 0; col < SPRITE_WIDTH; ++col) {
                const pixel = this.extractPixel(lineData, col)

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

    public extractPixel(line: LineData, col: number): Pixel {
        return isBitSet(line, col) ? 1 : 0
    }
}