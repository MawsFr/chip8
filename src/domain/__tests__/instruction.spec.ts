import { Instruction, type InstructionContext } from "../instruction.ts";
import { beforeEach, describe } from "vitest";
import { useTestContext } from "./helpers/useTestContext.ts";

class Mock$00E0 extends Instruction {
    constructor(context: InstructionContext) {
        super(context, 0x00E0, 0xFFFF)
    }

    execute(): void {
        throw new Error("Method not implemented.");
    }
}

describe('Instruction', () => {
    let context

    beforeEach(() => {
        context = useTestContext()
    })

    it('should return cpu', () => {
        const instruction = new Mock$00E0(context)

        expect(instruction.cpu).to.equal(context.cpu)
    });

    it('should return graphics', () => {
        const instruction = new Mock$00E0(context)

        expect(instruction.graphics).to.equal(context.graphics)
    });

    it('should return stack', () => {
        const instruction = new Mock$00E0(context)

        expect(instruction.stack).to.equal(context.stack)
    });

    describe('matches()', () => {
        it("should return true if the instruction matches the fetched opcode", () => {
            const fetchedOpcode = 0x00E0
            const instruction = new Mock$00E0()

            const result = instruction.matches(fetchedOpcode)

            expect(result).toBeTruthy()
        });

        it("should return false if the instruction does not match the fetched opcode", () => {
            const fetchedOpcode = 0x00A0
            const instruction: Instruction = new Mock$00E0()

            const result = instruction.matches(fetchedOpcode)

            expect(result).toBeFalsy()
        });
    });
});