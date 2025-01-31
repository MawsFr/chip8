import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $BNNN } from "../../instructions/$BNNN.ts";
import { Opcode } from "../../opcode.ts";

describe('BNNN : Jump to address NNN', () => {
    let context: InstructionContext;
    let instruction: $BNNN

    beforeEach(() => {
        context = useTestContext()
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
        context.cpu.setProgramCounter(0x200)
        context.registers.setV(0, 0x20)

        instruction.execute({ nnn: 0x200 })

        expect(context.cpu.getProgramCounter()).to.equal(0x220)
    });
});