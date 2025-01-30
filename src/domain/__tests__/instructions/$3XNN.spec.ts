import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $3XNN } from "../../instructions/$3XNN.ts";

describe('3XNN : Skips the next instruction if VX equals NN', () => {
    let context: InstructionContext;
    let instruction: $3XNN

    beforeEach(() => {
        context = useTestContext()
        instruction = new $3XNN(context)
    })

    it('should match 3XNN', () => {
        // Given
        const fetchedOpcode = 0x3200

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"3XNN" should skip next instruction if VX equals NN', () => {
        context.registers.setV(0, 0x20)
        context.cpu.setProgramCounter(0x400)

        instruction.execute({ x: 0, nn: 0x20 })

        expect(context.cpu.getProgramCounter()).to.equal(0x404)
    });

    it('"3XNN" should not skip next instruction if VX different NN', () => {
        context.cpu.setProgramCounter(0x400)
        context.registers.setV(0, 0x20)

        instruction.execute({ x: 0, nn: 0x30 })

        expect(context.cpu.getProgramCounter()).to.equal(0x402)
    });
});