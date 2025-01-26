import { Timer } from "./timers.ts";
import { afterEach, expect, vi } from "vitest";

describe('Timer', () => {
    let timer: Timer

    beforeEach(() => {
        timer = new Timer();
        timer.write(30)
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.clearAllTimers()
    })

    describe('value', () => {
        it('should be readable ', () => {
            expect(timer.read()).to.equal(30)
        })

        it('should be writable', () => {
            expect(timer).property('value').to.equal(30)
        })
    })

    describe('tick()', () => {
        it('should decrease at each tick', () => {
            timer.tick()
            expect(timer).property('value').to.equal(29)

            timer.tick()
            expect(timer).property('value').to.equal(28)
        })

        it('should not decrease when 0', () => {
            timer.write(0)

            timer.tick()
            expect(timer).property('value').to.equal(0)
        })
    });

    describe('countDownToZero()', () => {
        it('should tick at 60 hertz', () => {
            vi.useFakeTimers()
            vi.spyOn(timer, 'tick').mockImplementation(() => {
            })

            timer.countDownToZero()

            vi.advanceTimersByTime(16)
            vi.advanceTimersByTime(16)

            expect(timer.tick).toHaveBeenCalledTimes(2)
        })

        it("should stop ticking when value reach 0", () => {
            timer.write(0)
            vi.useFakeTimers()
            vi.spyOn(timer, 'tick').mockImplementation(() => {

            })

            timer.countDownToZero()

            expect(timer.tick).not.toHaveBeenCalled()
        })
    });

    describe('stopCountDown()', () => {
        it('should clean interval', () => {
            vi.spyOn(globalThis, 'clearInterval')

            timer.countDownToZero()
            timer.stopCountDown()

            expect(timer.getInterval()).toBeNull()
            expect(globalThis.clearInterval).toHaveBeenCalledTimes(1)
        })
    });
})