import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $EX9E } from "../../instructions/$EX9E.ts";
import { Opcode } from "../../opcode.ts";

describe('EX9E : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $EX9E

    beforeEach(() => {
        context = useTestContext()
        instruction = new $EX9E(context)
    })

    it('should match EX9E', () => {
        // Given
        const fetchedOpcode = 0xE19E

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"EX9E" should skip the next instruction if the key in VX is pressed', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x8)
        context.input.press(0x8)

        instruction.execute({ x: 0 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x204)
    });

    it('"EX9E" should not skip the next instruction if the key in VX is not pressed', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x8)
        context.input.release(0x8)

        instruction.execute({ x: 0 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});