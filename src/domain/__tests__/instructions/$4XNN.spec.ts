import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { $4XNN } from "../../instructions/$4XNN.ts";
import { Opcode } from "../../opcode.ts";

describe('4XNN : Skips the next instruction if VX equals NN', () => {
    let context: InstructionConfig;
    let instruction: $4XNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $4XNN(context)
    })

    it('should match 4XNN', () => {
        // Given
        const fetchedOpcode = 0x40FF

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    });

    it('"4XNN" should skip next instruction if VX is different from NN', () => {
        context.cpu.jumpToAddress(0x400)
        context.registers.setV(0, 0x40)

        instruction.execute({ x: 0, nn: 0x20 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x404)
    });

    it('"4XNN" should not skip next instruction if VX is equal to NN', () => {
        context.cpu.jumpToAddress(0x400)
        context.registers.setV(0, 0x40)

        instruction.execute({ x: 0, nn: 0x40 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x402)
    });
});