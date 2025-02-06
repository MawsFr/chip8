import { beforeEach, describe, expect, it } from "vitest";
import { $1NNN, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($1NNN, () => {
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