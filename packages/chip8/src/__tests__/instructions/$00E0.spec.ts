import { expect, vi } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $00E0 } from "../../instructions/$00E0.ts";
import { Opcode } from "../../opcode.ts";

describe('00E0 : Clear screen', () => {
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