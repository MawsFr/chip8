import { beforeEach, describe, expect, it } from "vitest";
import { $0000, type InstructionConfig, Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('00E0 : Call machine code routine (IGNORED)', () => {
    let instructionConfig: InstructionConfig;
    let instruction: $0000

    beforeEach(() => {
        instructionConfig = useTestInstructionConfig()
        instruction = new $0000(instructionConfig)
    })

    it('should match 0000', () => {
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