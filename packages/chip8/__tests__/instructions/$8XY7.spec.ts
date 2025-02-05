import { beforeEach, describe, expect, it } from "vitest";
import { $8XY7, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('8XY7 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionConfig;
    let instruction: $8XY7

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $8XY7(context)
    })

    it('should match 8XY7', () => {
        // Given
        const fetchedOpcode = 0x8127

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY7" should set VX to VY minus VX. VF is set to 1 if VY >= VX', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x30)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x10)
        expect(context.registers.getV(0xF)).to.equal(1)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });

    it('"8XY7" should set VX to VY minus VX. VF is set to 0 if VY < VX', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x30)
        context.registers.setV(1, 0x20)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0xF0)
        expect(context.registers.getV(0xF)).to.equal(0)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});