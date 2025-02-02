import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { $8XY0 } from "../../instructions/$8XY0.ts";
import { Opcode } from "../../opcode.ts";

describe('8XY0 : Sets VX to the value of VY', () => {
    let context: InstructionConfig;
    let instruction: $8XY0

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $8XY0(context)
    })

    it('should match 8XY0', () => {
        // Given
        const fetchedOpcode = 0x8120

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY0" should set VX to the value of VY', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x40)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});