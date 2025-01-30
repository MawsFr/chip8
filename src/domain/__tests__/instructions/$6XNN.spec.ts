import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $6XNN } from "../../instructions/$6XNN.ts";

describe('6XNN : Sets VX to NN', () => {
    let context: InstructionContext;
    let instruction: $6XNN

    beforeEach(() => {
        context = useTestContext()
        instruction = new $6XNN(context)
    })

    it('"6XNN" should set VX to NN', () => {
        // Given
        context.cpu.setProgramCounter(0x200)

        // When
        instruction.execute({ x: 0, nn: 0x20 })

        // Then
        expect(context.registers.getV(0)).to.equal(0x20)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});