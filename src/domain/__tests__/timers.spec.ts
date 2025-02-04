import { Timer } from "../timers.ts";
import { expect } from "vitest";

describe(Timer, () => {
    let timer: Timer

    beforeEach(() => {
        timer = new Timer();
        timer.write(30)
    })

    describe(Timer.prototype.read, () => {
        it('should return the current value', () => {
            expect(timer.read()).to.equal(30)
        })
    })

    describe(Timer.prototype.write, () => {
        it('should write a new value', () => {
            timer.write(60)
            expect(timer.read()).to.equal(60)
        })
    });

    describe(Timer.prototype.tick, () => {
        it('should decrease at each tick', () => {
            timer.tick()
            expect(timer.read()).to.equal(29)

            timer.tick()
            expect(timer.read()).to.equal(28)
        })

        it('should not decrease when 0', () => {
            timer.write(0)

            timer.tick()
            expect(timer.read()).to.equal(0)
        })
    });

    describe(Timer.prototype.reset, () => {
        it('should reset the timer', () => {
            timer.tick()
            timer.reset()

            expect(timer.read()).to.equal(0)
        });
    });
})