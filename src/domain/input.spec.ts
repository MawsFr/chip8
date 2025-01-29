import { Input } from "./input.ts";

describe('Input', () => {
    let input: Input

    beforeEach(() => {
        input = new Input()
    })

    it('should have 16 keys', () => {
        expect(input).to.have.property('keys').which
            .is.instanceof(Array)
            .and.has.length(16)
    })

    describe('press()', () => {
        it('should toggle the state of a key to pressed', () => {
            input.press(0)

            expect(input.isPressed(0)).toBeTruthy()
        })
    });

    describe('release()', () => {
        it('should toggle the state of a key to released', () => {
            input.press(0)
            assert(input.isPressed(0))

            input.release(0)

            expect(input.isPressed(0)).toBeFalsy()
        })
    });

    describe('isPressed()', () => {
        it('should return true when key is pressed', () => {
            input.press(0)

            expect(input.isPressed(0)).toBeTruthy()
        })
    });

    describe('waitForPress()', () => {
        it('should wait for a key', async () => {
            setTimeout(() => {
                input.press(0x1)
            }, 100)

            const key = await input.waitForPress()

            expect(key).to.equal(0x1)
        });
    });
});