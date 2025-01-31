import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $FX1E } from "../../instructions/$FX1E.ts";
import { Opcode } from "../../opcode.ts";

describe('FX1E : Adds VX to I. VF is not affected', () => {
    let context: InstructionContext;
    let instruction: $FX1E

    beforeEach(() => {
        context = useTestContext()
        instruction = new $FX1E(context)
    })

    it('should match FX1E', () => {
        // Given
        const fetchedOpcode = 0xF11E

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX1E" should add VX to I', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setI(0x20)

        instruction.execute({ x: 0 })

        expect(context.registers.getI()).to.equal(0x40)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});