import { beforeEach, describe, expect, it } from "vitest";
import { $8XY4, type InstructionConfig, Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('8XY4 : Adds VY to VX. Overflow is managed in VF', () => {
    let context: InstructionConfig;
    let instruction: $8XY4

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $8XY4(context)
    })

    it('should match 8XY4', () => {
        // Given
        const fetchedOpcode = 0x8124

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY4" should add VY to VX. VF is set to 1 if overflow', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0xFF)
        context.registers.setV(1, 0xFF)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0xFE)
        expect(context.registers.getV(0xF)).to.equal(1)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });

    it('"8XY4" should add VY to VX. VF is set to 0 if no overflow', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x30)
        context.registers.setV(0xF, 1)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x50)
        expect(context.registers.getV(0xF)).to.equal(0)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});