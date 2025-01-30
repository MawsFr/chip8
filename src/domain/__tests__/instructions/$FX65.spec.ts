import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $FX65 } from "../../instructions/$FX65.ts";

describe('FX65 : Stores from V0 to VX (including VX) in memory, starting at address I.', () => {
    let context: InstructionContext;
    let instruction: $FX65

    beforeEach(() => {
        context = useTestContext()
        instruction = new $FX65(context)
    })

    it('should match FX65', () => {
        // Given
        const fetchedOpcode = 0xF165

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX65" should fill from V0 to VX (included) from memory starting at I', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setI(0x300)
        context.memory.load([ 0x12, 0x34, 0x56, 0x78 ])

        instruction.execute({ x: 3 })

        expect(context.registers.getV(0x0)).to.equal(0x12)
        expect(context.registers.getV(0x1)).to.equal(0x34)
        expect(context.registers.getV(0x2)).to.equal(0x56)
        expect(context.registers.getV(0x3)).to.equal(0x78)

        expect(context.cpu.getProgramCounter()).to.equal(0x202);
    });
});