import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { $00EE } from "../../instructions/$00EE.ts";
import { Opcode } from "../../opcode.ts";

describe('00EE : Return from a subroutine', () => {
    let context: InstructionConfig;
    let instruction: $00EE

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $00EE(context)
    })

    it('should match 00EE', () => {
        // Given
        const fetchedOpcode = 0x00EE

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('should return from a subroutine', () => {
        // Given
        vi.spyOn(context.cpu, 'returnFromSubroutine').mockImplementation(() => {
        });

        context.cpu.jumpToAddress(0x200)

        // When
        instruction.execute()

        // Then
        expect(context.cpu.returnFromSubroutine).toHaveBeenCalledOnce()
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    })
});