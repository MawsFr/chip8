import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $8XY4 } from "../../instructions/$8XY4.ts";
import { Opcode } from "../../opcode.ts";

describe('8XY4 : Adds VY to VX. Overflow is managed in VF', () => {
    let context: InstructionContext;
    let instruction: $8XY4

    beforeEach(() => {
        context = useTestContext()
        instruction = new $8XY4(context)
    })

    it('should match 8XY4', () => {
        // Given
        const fetchedOpcode = 0x8124

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"8XY4" should add VY to VX. VF is set to 1 if overflow', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0xFF)
        context.registers.setV(1, 0xFF)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0xFE)
        expect(context.registers.getV(0xF)).to.equal(1)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });

    it('"8XY4" should add VY to VX. VF is set to 0 if no overflow', () => {
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x20)
        context.registers.setV(1, 0x30)
        context.registers.setV(0xF, 1)

        instruction.execute({ x: 0, y: 1 })

        expect(context.registers.getV(0)).to.equal(0x50)
        expect(context.registers.getV(0xF)).to.equal(0)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});