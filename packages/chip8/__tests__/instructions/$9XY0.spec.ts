import { beforeEach, describe, expect, it } from "vitest";
import { $9XY0, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('9XY0 : Sets VX to the value of VY', () => {
    let context: InstructionConfig;
    let instruction: $9XY0

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $9XY0(context)
    })

    it('should match 9XY0', () => {
        // Given
        const fetchedOpcode = 0x9120

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"9XY0" should skip the next instruction if VX is different of VY', () => {
        context.cpu.jumpToAddress(0x400)
        context.registers.setV(0, 0x40)
        context.registers.setV(1, 0x41)

        instruction.execute({ x: 0, y: 1 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x404)
    });

    it('"9XY0" should not skip the next instruction if VX is equal to VY', () => {
        context.cpu.jumpToAddress(0x400)
        context.registers.setV(0, 0x40)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x402)
    });
});