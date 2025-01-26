import { Graphics } from "./graphics.ts";
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
            graphics.switchOn(0)
            expect(graphics.getPixelAt(0)).toBeTruthy()
        })
    });

    describe('switchOn()', () => {
        it('should switch on a dead pixel', () => {
            const { wasAlive } = graphics.switchOn(0)

            expect(graphics.getPixelAt(0)).toBeTruthy()
            expect(wasAlive).toBeFalsy()
        })

        it('should switch off an alive pixel', () => {
            graphics.switchOn(0)
            const { wasAlive } = graphics.switchOn(0)

            expect(graphics.getPixelAt(0)).toBeTruthy()
            expect(wasAlive).toBeTruthy()
        })
    });

    describe('clearScreen()', () => {
        it('should clear screen', () => {
            Array.from(Array(2048).keys())
                .forEach(i => graphics.switchOn(i))

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
            expect(graphics.getPixelAt(64)).equals(true)
            expect(wasOverlapping).toBeFalsy()
        });

        it('should draw the sprite with overlapping', () => {
            graphics.switchOn(0)
            graphics.switchOn(2)
            const sprite = Uint8Array.from([
                0xA0,
                0x40,
            ])

            const { wasOverlapping } = graphics.drawSprite(0, 0, sprite)

            expect(graphics.getPixelAt(0)).equals(true)
            expect(graphics.getPixelAt(2)).equals(true)
            expect(graphics.getPixelAt(64)).equals(true)
            expect(wasOverlapping).toBeTruthy()
        });
    });
});