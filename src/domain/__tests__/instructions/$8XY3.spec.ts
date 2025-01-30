import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $8XY3 } from "../../instructions/$8XY3.ts";

describe('8XY3 : Sets VX to VX "xor" VY', () => {
    let context: InstructionContext;
    let instruction: $8XY3

    beforeEach(() => {
        context = useTestContext()
        instruction = new $8XY3(context)
    })

    it('should match 8XY3', () => {
        // Given
        const fetchedOpcode = 0x8123

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY3" should set VX to VX "wor" VY', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x60)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});