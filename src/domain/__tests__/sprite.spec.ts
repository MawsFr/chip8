import { Sprite } from "../sprite.ts";
import { expect } from "vitest";

describe('Sprite', () => {
    it('should create successfully', () => {
        const sprite = new Sprite(Uint8Array.from([ 0xA0, 0x40 ]), { x: 0, y: 0 })

        expect(sprite).to.be.instanceOf(Sprite)
    });

    it('should iterate over each pixel with its position', () => {
        const sprite = new Sprite(Uint8Array.from([ 0xA0, 0x40 ]), { x: 0, y: 0 })

        const pixels = Array.from(sprite[Symbol.iterator]())

        expect(pixels).to.deep.equal([
            { pixel: 1, position: { x: 0, y: 0 } },
            { pixel: 0, position: { x: 1, y: 0 } },
            { pixel: 1, position: { x: 2, y: 0 } },
            { pixel: 0, position: { x: 3, y: 0 } },
            { pixel: 0, position: { x: 4, y: 0 } },
            { pixel: 0, position: { x: 5, y: 0 } },
            { pixel: 0, position: { x: 6, y: 0 } },
            { pixel: 0, position: { x: 7, y: 0 } },
            { pixel: 0, position: { x: 0, y: 1 } },
            { pixel: 1, position: { x: 1, y: 1 } },
            { pixel: 0, position: { x: 2, y: 1 } },
            { pixel: 0, position: { x: 3, y: 1 } },
            { pixel: 0, position: { x: 4, y: 1 } },
            { pixel: 0, position: { x: 5, y: 1 } },
            { pixel: 0, position: { x: 6, y: 1 } },
            { pixel: 0, position: { x: 7, y: 1 } },
        ])
    })

    it('should modulo position correctly', () => {
        const sprite = new Sprite(Uint8Array.from([ 0xA0, 0x40 ]), { x: 63, y: 31 })

        const pixels = Array.from(sprite[Symbol.iterator]())

        expect(pixels).to.deep.equal([
            { pixel: 1, position: { x: 63, y: 31 } },
            { pixel: 0, position: { x: 0, y: 31 } },
            { pixel: 1, position: { x: 1, y: 31 } },
            { pixel: 0, position: { x: 2, y: 31 } },
            { pixel: 0, position: { x: 3, y: 31 } },
            { pixel: 0, position: { x: 4, y: 31 } },
            { pixel: 0, position: { x: 5, y: 31 } },
            { pixel: 0, position: { x: 6, y: 31 } },
            { pixel: 0, position: { x: 63, y: 0 } },
            { pixel: 1, position: { x: 0, y: 0 } },
            { pixel: 0, position: { x: 1, y: 0 } },
            { pixel: 0, position: { x: 2, y: 0 } },
            { pixel: 0, position: { x: 3, y: 0 } },
            { pixel: 0, position: { x: 4, y: 0 } },
            { pixel: 0, position: { x: 5, y: 0 } },
            { pixel: 0, position: { x: 6, y: 0 } },
        ])
    })

    it('should extract pixel correctly', () => {
        const sprite = new Sprite(Uint8Array.from([ 0xA0, 0x40 ]), { x: 0, y: 0 })

        const pixel = sprite['extractPixel'](0, 0)

        expect(pixel).to.equal(1)
    })
});