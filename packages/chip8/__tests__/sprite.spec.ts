import { describe, expect, it } from "vitest";
import { Sprite } from "../src";

describe(Sprite, () => {
    it('should create successfully', () => {
        const sprite = new Sprite(Uint8Array.from([ 0xA0, 0x40 ]))

        expect(sprite).to.be.instanceOf(Sprite)
    });

    it('should iterate over each pixel with its position', () => {
        const sprite = new Sprite(Uint8Array.from([ 0xA0, 0x40 ]))

        const pixels = Array.from(sprite[Symbol.iterator]())

        expect(pixels).to.deep.equal([
            { pixel: 1, offset: { x: 0, y: 0 } },
            { pixel: 0, offset: { x: 1, y: 0 } },
            { pixel: 1, offset: { x: 2, y: 0 } },
            { pixel: 0, offset: { x: 3, y: 0 } },
            { pixel: 0, offset: { x: 4, y: 0 } },
            { pixel: 0, offset: { x: 5, y: 0 } },
            { pixel: 0, offset: { x: 6, y: 0 } },
            { pixel: 0, offset: { x: 7, y: 0 } },
            { pixel: 0, offset: { x: 0, y: 1 } },
            { pixel: 1, offset: { x: 1, y: 1 } },
            { pixel: 0, offset: { x: 2, y: 1 } },
            { pixel: 0, offset: { x: 3, y: 1 } },
            { pixel: 0, offset: { x: 4, y: 1 } },
            { pixel: 0, offset: { x: 5, y: 1 } },
            { pixel: 0, offset: { x: 6, y: 1 } },
            { pixel: 0, offset: { x: 7, y: 1 } },
        ])
    })

    describe(Sprite.prototype.extractPixel, () => {
        it('should extract pixel correctly', () => {
            const sprite = new Sprite(Uint8Array.from([ 0xA0, 0x40 ]))

            const pixel = sprite.extractPixel(0xA0, 0)

            expect(pixel).to.equal(1)
        })
    });
});