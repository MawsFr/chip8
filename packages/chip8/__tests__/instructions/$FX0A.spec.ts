import { beforeEach, describe, expect, it } from "vitest";
import { $FX0A, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($FX0A, () => {
    let context: InstructionConfig;
    let instruction: $FX0A

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX0A(context)
    })

    it('should match FX0A', () => {
        // Given
        const fetchedOpcode = 0xF10A

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX0A" should await for a key press', async () => {
        context.cpu.jumpToAddress(0x200)
        setTimeout(() => {
            context.input.press(0x1)
        }, 100)

        instruction.execute({ x: 0 })

        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(context.registers.getV(0)).to.equal(0x1)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});