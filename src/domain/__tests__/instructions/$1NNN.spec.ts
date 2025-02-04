import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $1NNN } from "../../instructions/$1NNN.ts";
import { Opcode } from "../../opcode.ts";

describe('1NNN : Jump to address NNN', () => {
    let context: InstructionConfig;
    let instruction: $1NNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $1NNN(context)
    })

    it('should match 1NNN', () => {
        // Given
        const fetchedOpcode = 0x120A

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('should jump to address', () => {
        // When
        instruction.execute({
            nnn: 0x20A
        })

        // Then
        expect(context.cpu.getCurrentAddress()).to.equal(0x20A)
    })
});