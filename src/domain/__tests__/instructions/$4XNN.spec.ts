import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $4XNN } from "../../instructions/$4XNN.ts";

describe('4XNN : Skips the next instruction if VX equals NN', () => {
    let context: InstructionContext;
    let instruction: $4XNN

    beforeEach(() => {
        context = useTestContext()
        instruction = new $4XNN(context)
    })

    it('should match 4XNN', () => {
        // Given
        const fetchedOpcode = 0x40FF

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    });

    it('"4XNN" should skip next instruction if VX is different from NN', () => {
        context.cpu.setProgramCounter(0x400)
        context.registers.setV(0, 0x40)

        instruction.execute({ x: 0, nn: 0x20 })

        expect(context.cpu.getProgramCounter()).to.equal(0x404)
    });

    it('"4XNN" should not skip next instruction if VX is equal to NN', () => {
        context.cpu.setProgramCounter(0x400)
        context.registers.setV(0, 0x40)

        instruction.execute({ x: 0, nn: 0x40 })

        expect(context.cpu.getProgramCounter()).to.equal(0x402)
    });
});