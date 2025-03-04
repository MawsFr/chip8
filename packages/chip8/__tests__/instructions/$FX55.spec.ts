import { beforeEach, describe, expect, it } from "vitest";
import { $FX55, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($FX55, () => {
    let context: InstructionConfig;
    let instruction: $FX55

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX55(context)
    })

    it('should match FX55', () => {
        // Given
        const fetchedOpcode = 0xF155

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX55" should store from V0 to VX (included) into memory starting at I', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0x0, 0x12);
        context.registers.setV(0x1, 0x34);
        context.registers.setV(0x2, 0x56);
        context.registers.setV(0x3, 0x78);
        context.registers.setI(0x300);

        instruction.execute({ x: 0x3 });

        expect(context.memory.getDataAt(0x300)).to.equal(0x12);
        expect(context.memory.getDataAt(0x301)).to.equal(0x34);
        expect(context.memory.getDataAt(0x302)).to.equal(0x56);
        expect(context.memory.getDataAt(0x303)).to.equal(0x78);

        expect(context.registers.getI()).to.equal(0x300 + 0x3 + 1);

        expect(context.cpu.getCurrentAddress()).to.equal(0x202);
    });
});