import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $FX18 } from "../../instructions/$FX18.ts";
import { Opcode } from "../../opcode.ts";

describe('FX18 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionConfig;
    let instruction: $FX18

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX18(context)
    })

    it('should match FX18', () => {
        // Given
        const fetchedOpcode = 0xF118

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX18" should set the sound timer to VX', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x30)

        instruction.execute({ x: 0 })

        expect(context.soundTimer.read()).to.equal(0x30)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});