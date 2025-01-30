import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $FX29 } from "../../instructions/$FX29.ts";

describe('FX29 : Sets I to the location of the sprite for the character in VX', () => {
    let context: InstructionContext;
    let instruction: $FX29

    beforeEach(() => {
        context = useTestContext()
        instruction = new $FX29(context)
    })

    it('should match FX29', () => {
        // Given
        const fetchedOpcode = 0xF129

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX29" should set I to the address of the character stored in VX', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x5)

        instruction.execute({ x: 0 })

        expect(context.registers.getI()).to.equal(0x19)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});