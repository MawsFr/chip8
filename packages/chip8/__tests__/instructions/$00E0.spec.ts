import { beforeEach, describe, expect, it, vi } from "vitest";
import { $00E0, InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($00E0, () => {
    let instructionConfig: InstructionConfig;
    let instruction: $00E0

    beforeEach(() => {
        instructionConfig = useTestInstructionConfig()
        instruction = new $00E0(instructionConfig)
    })

    it('should match 00E0', () => {
        // Given
        const fetchedOpcode = 0x00E0

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    });

    it('should clear the screen', () => {
        // Given
        vi.spyOn(instructionConfig.graphics, 'clearScreen').mockImplementation(() => {
        });

        instructionConfig.cpu.jumpToAddress(0x200)

        // When
        instruction.execute()

        // Then
        expect(instructionConfig.graphics.clearScreen).toHaveBeenCalledOnce()
        expect(instructionConfig.cpu.getCurrentAddress()).to.equal(0x202)
    })
});