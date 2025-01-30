import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $FX15 } from "../../instructions/$FX15.ts";

describe('FX15 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $FX15

    beforeEach(() => {
        context = useTestContext()
        instruction = new $FX15(context)
    })

    it('should match FX15', () => {
        // Given
        const fetchedOpcode = 0xF115

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX15" should set the delay timer to VX', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x30)

        instruction.execute({ x: 0 })

        expect(context.delayTimer.read()).to.equal(0x30)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});