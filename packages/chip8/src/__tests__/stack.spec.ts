import Stack from "../stack.ts";
import { expect } from "vitest";

describe(Stack, () => {
    let stack: Stack

    beforeEach(() => {
        stack = new Stack()
    })

    it('should have 16 slots', () => {
        expect(stack.slots)
            .to.be.instanceof(Uint16Array)
            .and.have.length(16)
    })

    describe(Stack.prototype.push, () => {
        it('should push a new return address', () => {
            stack.push(0x200)

            expect(stack).property('slots').to.deep.equal(Uint16Array.from([ 0x200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]))
            expect(stack).property('currentIndex').to.equal(1)
        });
    });

    describe(Stack.prototype.pop, () => {
        it('should pop the last inserted address', () => {
            stack.push(0x200)

            const nextReturnAddress = stack.pop()

            expect(nextReturnAddress).to.equal(0x200)
            expect(stack).property('slots').to.deep.equal(Uint16Array.from(Array(16).fill(0)))
            expect(stack).property('currentIndex').to.equal(0)
        });
    });
})