import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { $8XYE } from "../../instructions/$8XYE.ts";
import { Opcode } from "../../opcode.ts";

describe('8XYE : VY is subtracted from VX. Underflow is managed in VF', () => {
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