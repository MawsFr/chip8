import { beforeEach, describe, expect, it } from "vitest";
import { $8XYE, type InstructionConfig } from "../../src/instructions";
import { Opcode } from "../../src";
import { useTestInstructionConfig } from "../helpers/test-configs";

describe($8XYE, () => {
    let context: InstructionConfig;
    let instruction: $8XYE

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $8XYE(context)
    })

    it('should match 8XYE', () => {
        // Given
        const fetchedOpcode = 0x812E

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XYE" should shift VX to the left. VF is set to the most significant bit of VX prior to the shift into VF.', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x88)

        instruction.execute({ x: 0 })

        expect(context.registers.getV(0)).to.equal(0x10)
        expect(context.registers.getV(0xF)).to.equal(0x1)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});