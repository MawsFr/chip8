import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $3XNN } from "../../instructions/$3XNN.ts";
import { Opcode } from "../../opcode.ts";

describe('3XNN : Skips the next instruction if VX equals NN', () => {
    let context: InstructionConfig;
    let instruction: $3XNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $3XNN(context)
    })

    it('should match 3XNN', () => {
        // Given
        const fetchedOpcode = 0x3200

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"3XNN" should skip next instruction if VX equals NN', () => {
        context.registers.setV(0, 0x20)
        context.cpu.jumpToAddress(0x400)

        instruction.execute({ x: 0, nn: 0x20 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x404)
    });

    it('"3XNN" should not skip next instruction if VX different NN', () => {
        context.cpu.jumpToAddress(0x400)
        context.registers.setV(0, 0x20)

        instruction.execute({ x: 0, nn: 0x30 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x402)
    });
});