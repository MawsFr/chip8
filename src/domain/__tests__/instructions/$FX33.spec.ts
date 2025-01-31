import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $FX33 } from "../../instructions/$FX33.ts";
import { Opcode } from "../../opcode.ts";

describe('FX33 : Sets I to the location of the sprite for the character in VX', () => {
    let context: InstructionContext;
    let instruction: $FX33

    beforeEach(() => {
        context = useTestContext()
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