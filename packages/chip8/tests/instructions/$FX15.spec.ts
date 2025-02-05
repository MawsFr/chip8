import { beforeEach, describe, expect, it } from "vitest";
import { $FX15, type InstructionConfig, Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('FX15 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionConfig;
    let instruction: $FX15

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX15(context)
    })

    it('should match FX15', () => {
        // Given
        const fetchedOpcode = 0xF115

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX15" should set the delay timer to VX', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x30)

        instruction.execute({ x: 0 })

        expect(context.delayTimer.read()).to.equal(0x30)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});