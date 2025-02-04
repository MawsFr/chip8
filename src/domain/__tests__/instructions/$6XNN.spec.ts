import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $6XNN } from "../../instructions/$6XNN.ts";
import { Opcode } from "../../opcode.ts";

describe('6XNN : Sets VX to NN', () => {
    let context: InstructionConfig;
    let instruction: $6XNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $6XNN(context)
    })

    it('should match 6XNN', () => {
        // Given
        const fetchedOpcode = 0x6120

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    });

    it('"6XNN" should set VX to NN', () => {
        // Given
        context.cpu.jumpToAddress(0x200)

        // When
        instruction.execute({ x: 0, nn: 0x20 })

        // Then
        expect(context.registers.getV(0)).to.equal(0x20)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});