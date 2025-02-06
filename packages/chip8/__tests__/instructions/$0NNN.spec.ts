import { beforeEach, describe, expect, it } from "vitest";
import { $0NNN, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($0NNN, () => {
    let instructionConfig: InstructionConfig;
    let instruction: $0NNN

    beforeEach(() => {
        instructionConfig = useTestInstructionConfig()
        instruction = new $0NNN(instructionConfig)
    })

    it('should match 0NNN', () => {
        // Given
        const fetchedOpcode = 0x0000

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    });

    it('should be ignored', () => {
        // Given
        instructionConfig.cpu.jumpToAddress(0x200)

        // When
        instruction.execute()

        // Then
        expect(instructionConfig.cpu.getCurrentAddress()).to.equal(0x202)
    })
});