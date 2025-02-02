import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { $5XY0 } from "../../instructions/$5XY0.ts";
import { Opcode } from "../../opcode.ts";

describe('5XY0 : Skips the next instruction if VX equals VY', () => {
    let context: InstructionConfig;
    let instruction: $5XY0

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $5XY0(context)
    })

    it('should match 5XY0', () => {
        // Given
        const fetchedOpcode = 0x5120

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"5XY0" should skip next instruction if VX equals VY', () => {
        context.cpu.jumpToAddress(0x400)
        context.registers.setV(0, 0x40)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x404)
    });

    it('"5XY0" should not skip next instruction if VX is different from VY', () => {
        context.cpu.jumpToAddress(0x400)
        context.registers.setV(0, 0x50)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x402)
    });
});