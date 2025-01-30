import { Graphics } from "../graphics.ts";
import { expect } from "vitest";

describe('Graphics', () => {
    let graphics: Graphics;

    beforeEach(() => {
        graphics = new Graphics()
    })

    it('should have a size of 64 x 32', () => {
        expect(graphics).to.have.property('pixels').which
            .is.instanceof(Array)
            .and.has.length(2048)
    });

    describe('getPixelAt()', () => {
        it('should get pixel state at index', () => {
            graphics.drawPixel(0, 1)
            expect(graphics.getPixelAt(0)).toBeTruthy()
        })
    });

    describe('toggle()', () => {
        it('should toggle on a dead pixel', () => {
            const { wasAlive } = graphics.drawPixel(0, 1)

            expect(graphics.getPixelAt(0)).toBeTruthy()
            expect(wasAlive).toBeFalsy()
        })

        it('should toggle off an alive pixel', () => {
            graphics.drawPixel(0, 1)
            const { wasAlive } = graphics.drawPixel(0, 0)

            expect(graphics.getPixelAt(0)).toBeTruthy()
            expect(wasAlive).toBeTruthy()
        })
    });

    describe('clearScreen()', () => {
        it('should clear screen', () => {
            Array.from(Array(2048).keys())
                .forEach(i => graphics.drawPixel(i, 1))

            graphics.clearScreen()

            expect(graphics).property('pixels').deep.equals(Array.from(Array(2048).fill(false)))
        });
    });

    describe('drawSprite()', () => {
        it('should draw the sprite without overlapping', () => {
            const sprite = Uint8Array.from([
                0xA0,
                0x40,
            ])

            const { wasOverlapping } = graphics.drawSprite(0, 0, sprite)

            expect(graphics.getPixelAt(0)).equals(true)
            expect(graphics.getPixelAt(2)).equals(true)
            expect(graphics.getPixelAt(65)).equals(true)
            expect(wasOverlapping).toBeFalsy()
        });

        it('should draw the sprite with overlapping', () => {
            graphics.drawPixel(0, 1)
            graphics.drawPixel(2, 1)
            const sprite = Uint8Array.from([
                0xA0,
                0x40,
            ])

            const { wasOverlapping } = graphics.drawSprite(0, 0, sprite)

            expect(graphics.getPixelAt(0)).equals(false)
            expect(graphics.getPixelAt(2)).equals(false)
            expect(graphics.getPixelAt(65)).equals(true)
            expect(wasOverlapping).toBeTruthy()
        });
    });
});