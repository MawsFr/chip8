import { beforeEach, describe, expect, it } from "vitest";
import { $FX33, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('FX33 : Sets I to the location of the sprite for the character in VX', () => {
    let context: InstructionConfig;
    let instruction: $FX33

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX33(context)
    })

    it('should match FX33', () => {
        // Given
        const fetchedOpcode = 0xF133

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX33" should store the BCD representation of VX in memory at location', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 123);
        context.registers.setI(0x300);

        instruction.execute({ x: 0 });

        expect(context.memory.getDataAt(0x300)).to.equal(1);
        expect(context.memory.getDataAt(0x301)).to.equal(2);
        expect(context.memory.getDataAt(0x302)).to.equal(3);

        expect(context.cpu.getCurrentAddress()).to.equal(0x202);
    });
});