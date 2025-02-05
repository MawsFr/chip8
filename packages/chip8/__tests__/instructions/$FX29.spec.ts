import { beforeEach, describe, expect, it } from "vitest";
import { $FX29, type InstructionConfig, Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe('FX29 : Sets I to the location of the sprite for the character in VX', () => {
    let context: InstructionConfig;
    let instruction: $FX29

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $FX29(context)
    })

    it('should match FX29', () => {
        // Given
        const fetchedOpcode = 0xF129

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"FX29" should set I to the address of the character stored in VX', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x5)

        instruction.execute({ x: 0 })

        expect(context.registers.getI()).to.equal(0x19)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});