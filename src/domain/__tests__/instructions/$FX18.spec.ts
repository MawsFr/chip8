import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $FX18 } from "../../instructions/$FX18.ts";

describe('FX18 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $FX18

    beforeEach(() => {
        context = useTestContext()
        instruction = new $FX18(context)
    })

    it('should match FX18', () => {
        // Given
        const fetchedOpcode = 0xF118

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX18" should set the sound timer to VX', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x30)

        instruction.execute({ x: 0 })

        expect(context.soundTimer.read()).to.equal(0x30)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});