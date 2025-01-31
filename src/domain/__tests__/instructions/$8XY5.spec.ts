import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $8XY5 } from "../../instructions/$8XY5.ts";
import { Opcode } from "../../opcode.ts";

describe('8XY5 : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $8XY5

    beforeEach(() => {
        context = useTestContext()
        instruction = new $8XY5(context)
    })

    it('should match 8XY5', () => {
        // Given
        const fetchedOpcode = 0x8125

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY5" should subtract VY from VX. VF is set to 1 if VX >= VY', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x30)
        context.registers.setV(1, 0x20)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x10)
        expect(context.registers.getV(0xF)).to.equal(1)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });

    it('"8XY5" should subtract VY from VX. VF is set to 0 if VX < VY', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x10)
        context.registers.setV(1, 0x20)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0xF0)
        expect(context.registers.getV(0xF)).to.equal(0)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});