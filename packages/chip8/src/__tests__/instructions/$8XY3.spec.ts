import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $8XY3 } from "../../instructions/$8XY3.ts";
import { Opcode } from "../../opcode.ts";

describe('8XY3 : Sets VX to VX "xor" VY', () => {
    let context: InstructionConfig;
    let instruction: $8XY3

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $8XY3(context)
    })

    it('should match 8XY3', () => {
        // Given
        const fetchedOpcode = 0x8123

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY3" should set VX to VX "wor" VY', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x40)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x60)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});