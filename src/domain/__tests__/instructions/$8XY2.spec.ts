import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $8XY2 } from "../../instructions/$8XY2.ts";
import { Opcode } from "../../opcode.ts";

describe('8XY2 : Sets VX to VX "and" VY', () => {
    let context: InstructionContext;
    let instruction: $8XY2

    beforeEach(() => {
        context = useTestContext()
        instruction = new $8XY2(context)
    })

    it('should match 8XY2', () => {
        // Given
        const fetchedOpcode = 0x8122

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY2" should set VX to VX "and" VY', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x0)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});