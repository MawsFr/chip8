import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $EXA1 } from "../../instructions/$EXA1.ts";
import { Opcode } from "../../opcode.ts";

describe('EXA1 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $EXA1

    beforeEach(() => {
        context = useTestContext()
        instruction = new $EXA1(context)
    })

    it('should match EXA1', () => {
        // Given
        const fetchedOpcode = 0xE1A1

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"EXA1" should skip the next instruction if the key in VX is not pressed', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x8)
        context.input.release(0x8)

        instruction.execute({ x: 0 })

        expect(context.cpu.getProgramCounter()).to.equal(0x204)
    });

    it('"EXA1" should not skip the next instruction if the key in VX is pressed', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x8)
        context.input.press(0x8)

        instruction.execute({ x: 0 })

        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});