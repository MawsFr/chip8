import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $7XNN } from "../../instructions/$7XNN.ts";
import { Opcode } from "../../opcode.ts";

describe('7XNN : Adds NN to VX', () => {
    let context: InstructionConfig;
    let instruction: $7XNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $7XNN(context)
    })

    it('should match 7XNN', () => {
        // Given
        const fetchedOpcode = 0x7120

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"7XNN" should add NN to VX without affecting VF', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0xFF)
        context.registers.setV(0xF, 1)

        instruction.execute({ x: 0, nn: 0x10 })

        expect(context.registers.getV(0)).to.equal(0x0F)
        expect(context.registers.getV(0xF)).to.equal(1)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});