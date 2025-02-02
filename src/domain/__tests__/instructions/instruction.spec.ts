import { Instruction, type InstructionConfig } from "../../instruction.ts";
import { beforeEach, describe } from "vitest";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { Opcode } from "../../opcode.ts";

class Mock$00E0 extends Instruction<undefined> {
    constructor(context: InstructionConfig) {
        super(0x00E0, 0xFFFF, context)
    }

    execute(): void {
        throw new Error("Method not implemented.");
    }
}

describe('Instruction', () => {
    let context: InstructionConfig
    let instruction: Mock$00E0

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new Mock$00E0(context)
    })

    describe('matches()', () => {
        it("should return true if the instruction matches the fetched opcode", () => {
            // Given
            const fetchedOpcode = 0x00E0

            // When
            const result = instruction.matches(new Opcode(fetchedOpcode))

            // Then
            expect(result).toBeTruthy()
        });

        it("should return false if the instruction does not match the fetched opcode", () => {
            // Given
            const fetchedOpcode = 0x00A0

            // When
            const result = instruction.matches(new Opcode(fetchedOpcode))

            // Then
            expect(result).toBeFalsy()
        });
    });
});