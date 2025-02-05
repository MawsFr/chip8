import { beforeEach, describe, expect, it } from "vitest";
import { $BNNN, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('BNNN : Jump to address NNN', () => {
    let context: InstructionConfig;
    let instruction: $BNNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $BNNN(context)
    })

    it('should match BNNN', () => {
        // Given
        const fetchedOpcode = 0xB20A

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"BNNN" should jump to the address NNN + V0', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x20)

        instruction.execute({ nnn: 0x200 })

        expect(context.cpu.getCurrentAddress()).to.equal(0x220)
    });
});