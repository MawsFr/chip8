import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $8XY0 } from "../../instructions/$8XY0.ts";

describe('8XY0 : Sets VX to the value of VY', () => {
    let context: InstructionContext;
    let instruction: $8XY0

    beforeEach(() => {
        context = useTestContext()
        instruction = new $8XY0(context)
    })

    it('should match 8XY0', () => {
        // Given
        const fetchedOpcode = 0x8120

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY0" should set VX to the value of VY', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x40)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});