import { beforeEach, describe, expect, it } from "vitest";
import { $ANNN, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('ANNN : Jump to address NNN', () => {
    let context: InstructionConfig;
    let instruction: $ANNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $ANNN(context)
    })

    it('should match ANNN', () => {
        // Given
        const fetchedOpcode = 0xA20A

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"ANNN" should set I to NNN', () => {
        context.cpu.jumpToAddress(0x200)

        instruction.execute({ nnn: 0x200 })

        expect(context.registers.getI()).to.equal(0x200)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});