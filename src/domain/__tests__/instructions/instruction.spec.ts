import { Instruction, type InstructionContext } from "../../instruction.ts";
import { beforeEach, describe } from "vitest";
import { useTestContext } from "../helpers/useTestContext.ts";

class Mock$00E0 extends Instruction<undefined> {
    constructor(context: InstructionContext) {
        super(context, 0x00E0, 0xFFFF)
    }

    execute(): void {
        throw new Error("Method not implemented.");
    }
}

describe('Instruction', () => {
    let context
    let instruction

    beforeEach(() => {
        context = useTestContext()
        instruction = new Mock$00E0(context)
    })

    it('should return cpu', () => {
        expect(instruction.cpu).to.equal(context.cpu)
    });

    it('should return graphics', () => {
        expect(instruction.graphics).to.equal(context.graphics)
    });

    it('should return stack', () => {
        expect(instruction.stack).to.equal(context.stack)
    });

    it('should return registers', () => {
        expect(instruction.registers).to.equal(context.registers)
    });

    describe('matches()', () => {
        it("should return true if the instruction matches the fetched opcode", () => {
            // Given
            const fetchedOpcode = 0x00E0

            // When
            const result = instruction.matches(fetchedOpcode)

            // Then
            expect(result).toBeTruthy()
        });

        it("should return false if the instruction does not match the fetched opcode", () => {
            // Given
            const fetchedOpcode = 0x00A0

            // When
            const result = instruction.matches(fetchedOpcode)

            // Then
            expect(result).toBeFalsy()
        });
    });
});