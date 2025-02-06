import { beforeEach, describe, expect, it } from "vitest";
import { $8XY2, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($8XY2, () => {
    let context: InstructionConfig;
    let instruction: $8XY2

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $8XY2(context)
    })

    it('should match 8XY2', () => {
        // Given
        const fetchedOpcode = 0x8122

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY2" should set VX to VX "and" VY', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x0)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});