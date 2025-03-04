import { beforeEach, describe, expect, it, vi } from "vitest";
import { $2NNN, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($2NNN, () => {
    let context: InstructionConfig;
    let instruction: $2NNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $2NNN(context)
    })

    it('should match 2NNN', () => {
        // Given
        const fetchedOpcode = 0x220A

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('should call a subroutine', () => {
        // Given
        vi.spyOn(context.cpu, 'callSubroutine').mockImplementation(() => {
        });

        context.cpu.jumpToAddress(0x200)

        // When
        instruction.execute({ nnn: 0x400 })

        // Then
        expect(context.cpu.callSubroutine).toHaveBeenCalledWith(0x400)
        expect(context.cpu.getCurrentAddress()).to.equal(0x200)
    })
});