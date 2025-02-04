import { Input } from "../input.ts";

describe(Input, () => {
    let input: Input

    beforeEach(() => {
        input = new Input()
    })

    it('should have 16 keys', () => {
        expect(input.keys)
            .to.be.an('array')
            .and.have.length(16)
    })

    describe(Input.prototype.press, () => {
        it('should toggle the state of a key to pressed', () => {
            input.press(0)

            expect(input.isPressed(0)).toBeTruthy()
        })
    });

    describe(Input.prototype.release, () => {
        it('should toggle the state of a key to released', () => {
            input.press(0)
            assert(input.isPressed(0))

            input.release(0)

            expect(input.isPressed(0)).toBeFalsy()
        })
    });

    describe(Input.prototype.isPressed, () => {
        it('should return true when key is pressed', () => {
            input.press(0)

            expect(input.isPressed(0)).toBeTruthy()
        })
    });

    describe(Input.prototype.waitForPress, () => {
        it('should wait for a key', async () => {
            setTimeout(() => {
                expect(input.isAwaitingForKey).toBeTruthy()

                input.press(0x1)

                expect(input.isAwaitingForKey).toBeFalsy()
            }, 500)

            const key = await input.waitForPress()

            expect(key).to.equal(0x1)
        });
    });
});