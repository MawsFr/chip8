import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $8XY6 } from "../../instructions/$8XY6.ts";
import { Opcode } from "../../opcode.ts";

describe('8XY6 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $8XY6

    beforeEach(() => {
        context = useTestContext()
        instruction = new $8XY6(context)
    })

    it('should match 8XY6', () => {
        // Given
        const fetchedOpcode = 0x8126

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY6" should shift VX to the right. VF is set to the least significant bit of VX prior to the shift into VF.', () => {
        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 0x23)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x11)
        expect(context.registers.getV(0xF)).to.equal(0x1)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});