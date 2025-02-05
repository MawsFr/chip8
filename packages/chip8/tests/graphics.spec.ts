import { Graphics, type Pixel, Sprite } from "../src";
import { beforeEach, describe, expect, it } from "vitest";

export const DEAD_PIXEL = 0
export const ALIVE_PIXEL = 1

describe(Graphics, () => {
    let graphics: Graphics;

    beforeEach(() => {
        graphics = new Graphics()
    })

    it('should have a size of 64 x 32', () => {
        expect(graphics.pixels)
            .to.be.an('array')
            .and.have.length(32)
            .and.satisfy((lines: Pixel[][]) => lines.every((line) => line.length === 64))
    });

    describe(Graphics.prototype.getPixelAt, () => {
        it('should get pixel state at x and y', () => {
            graphics.drawPixel(ALIVE_PIXEL, { x: 0, y: 0 })
            expect(graphics.getPixelAt({ x: 0, y: 0 })).to.equal(ALIVE_PIXEL)
        })
    });

    describe(Graphics.prototype.drawPixel, () => {
        it('should draw a pixel', () => {
            graphics.drawPixel(DEAD_PIXEL, { x: 0, y: 0 })
            const { pixelsAreColliding } = graphics.drawPixel(ALIVE_PIXEL, { x: 0, y: 0 })

            expect(graphics.getPixelAt({ x: 0, y: 0 })).to.equal(ALIVE_PIXEL)
            expect(pixelsAreColliding).toBeFalsy()
        })

        it('should leave alive pixel alive when drawing dead pixel', () => {
            graphics.drawPixel(ALIVE_PIXEL, { x: 0, y: 0 })
            const { pixelsAreColliding } = graphics.drawPixel(DEAD_PIXEL, { x: 0, y: 0 })

            expect(graphics.getPixelAt({ x: 0, y: 0 })).to.equal(ALIVE_PIXEL)
            expect(pixelsAreColliding).toBeFalsy()
        })

        it('should turn dead an alive pixel when drawing alive pixel over it', () => {
            graphics.drawPixel(ALIVE_PIXEL, { x: 0, y: 0 })
            const { pixelsAreColliding } = graphics.drawPixel(ALIVE_PIXEL, { x: 0, y: 0 })

            expect(graphics.getPixelAt({ x: 0, y: 0 })).to.equal(DEAD_PIXEL)
            expect(pixelsAreColliding).toBeTruthy()
        })
    });

    describe(Graphics.prototype.clearScreen, () => {
        it('should clear screen', () => {
            graphics.fillScreen(ALIVE_PIXEL)

            graphics.clearScreen()

            expect(graphics.pixels).to.deep.equal(Array.from({ length: 32 }, () => Array.from({ length: 64 }, () => DEAD_PIXEL)))

        });
    });

    describe(Graphics.prototype.fillScreen, () => {
        it('should fill screen with pixel', () => {
            graphics.fillScreen(ALIVE_PIXEL)

            expect(graphics.pixels).to.deep.equal(Array.from({ length: 32 }, () => Array.from({ length: 64 }, () => ALIVE_PIXEL)))
        });
    });

    describe(Graphics.prototype.drawSprite, () => {
        it('should draw the sprite without overlapping', () => {
            const sprite = new Sprite(Uint8Array.from([
                0xA0,
                0x40,
            ]))

            const { wasOverlapping } = graphics.drawSprite(sprite, { x: 0, y: 0 })

            expect(graphics.getPixelAt({ x: 0, y: 0 })).equals(ALIVE_PIXEL)
            expect(graphics.getPixelAt({ x: 2, y: 0 })).equals(ALIVE_PIXEL)
            expect(graphics.getPixelAt({ x: 1, y: 1 })).equals(ALIVE_PIXEL)
            expect(wasOverlapping).toBeFalsy()
        });

        it('should draw the sprite with overlapping', () => {
            graphics.drawPixel(ALIVE_PIXEL, { x: 0, y: 0 })
            graphics.drawPixel(ALIVE_PIXEL, { x: 2, y: 0 })
            const sprite = new Sprite(Uint8Array.from([
                0xA0,
                0x40,
            ]))

            const { wasOverlapping } = graphics.drawSprite(sprite, { x: 0, y: 0 })

            expect(graphics.getPixelAt({ x: 0, y: 0 })).equals(DEAD_PIXEL)
            expect(graphics.getPixelAt({ x: 2, y: 0 })).equals(DEAD_PIXEL)
            expect(graphics.getPixelAt({ x: 1, y: 1 })).equals(ALIVE_PIXEL)
            expect(wasOverlapping).toBeTruthy()
        });

        it('should draw a sprite that goes out of bounds', () => {
            const sprite = new Sprite(Uint8Array.from([
                0xA0,
                0x40,
            ]))

            graphics.drawSprite(sprite, { x: 63, y: 31 })

            expect(graphics.getPixelAt({ x: 63, y: 31 })).equals(ALIVE_PIXEL)
            expect(graphics.getPixelAt({ x: 1, y: 31 })).equals(ALIVE_PIXEL)
            expect(graphics.getPixelAt({ x: 0, y: 0 })).equals(ALIVE_PIXEL)
        })
    });

    describe(Graphics.prototype.mergePixels, () => {
        it('should merge pixels', () => {
            expect(graphics.mergePixels(DEAD_PIXEL, ALIVE_PIXEL)).equals(ALIVE_PIXEL)
            expect(graphics.mergePixels(ALIVE_PIXEL, ALIVE_PIXEL)).equals(DEAD_PIXEL)
            expect(graphics.mergePixels(DEAD_PIXEL, DEAD_PIXEL)).equals(DEAD_PIXEL)
            expect(graphics.mergePixels(ALIVE_PIXEL, DEAD_PIXEL)).equals(ALIVE_PIXEL)
        });
    });
});