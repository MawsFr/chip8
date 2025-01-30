import { Timer } from "../timers.ts";
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

})