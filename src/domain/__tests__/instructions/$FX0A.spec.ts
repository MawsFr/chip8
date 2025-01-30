import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $FX0A } from "../../instructions/$FX0A.ts";

describe('FX0A : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $FX0A

    beforeEach(() => {
        context = useTestContext()
        instruction = new $FX0A(context)
    })

    it('should match FX0A', () => {
        // Given
        const fetchedOpcode = 0xF10A

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX0A" should await for a key press', async () => {
        context.cpu.setProgramCounter(0x200)
        setTimeout(() => {
            context.input.press(0x1)
        }, 100)

        instruction.execute({ x: 0 })

        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(context.registers.getV(0)).to.equal(0x1)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});