import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { $FX07 } from "../../instructions/$FX07.ts";
import { Opcode } from "../../opcode.ts";

describe('FX07 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionConfig;
    let instruction: $FX07

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX07(context)
    })

    it('should match FX07', () => {
        // Given
        const fetchedOpcode = 0xF107

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX07" should set VX to the value of the delay timer', () => {
        context.cpu.jumpToAddress(0x200)
        context.delayTimer.write(0x30)

        instruction.execute({ x: 0 })

        expect(context.registers.getV(0)).to.equal(0x30)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});