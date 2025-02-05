import { beforeEach, describe, expect, it } from "vitest";
import { $FX65, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('FX65 : Stores from V0 to VX (including VX) in memory, starting at address I.', () => {
    let context: InstructionConfig;
    let instruction: $FX65

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX65(context)
    })

    it('should match FX65', () => {
        // Given
        const fetchedOpcode = 0xF165

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX65" should fill from V0 to VX (included) from memory starting at I', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setI(1)
        context.memory.load([ 0x12, 0x34, 0x56, 0x78 ])
        context.registers.setI(2)

        instruction.execute({ x: 2 })

        expect(context.registers.getV(0x0)).to.equal(0x34)
        expect(context.registers.getV(0x1)).to.equal(0x56)
        expect(context.registers.getV(0x2)).to.equal(0x78)

        expect(context.registers.getI()).to.equal(2 + 2 + 1);

        expect(context.cpu.getCurrentAddress()).to.equal(0x202);
    });
});