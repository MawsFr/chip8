import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $2NNN } from "../../instructions/$2NNN.ts";
import { Opcode } from "../../opcode.ts";

describe('2NNN : Calls subroutine at NNN', () => {
    let context: InstructionContext;
    let instruction: $2NNN

    beforeEach(() => {
        context = useTestContext()
        instruction = new $2NNN(context)
    })

    it('should match 2NNN', () => {
        // Given
        const fetchedOpcode = 0x220A

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('should call a subroutine', () => {
        // Given
        vi.spyOn(context.cpu, 'callSubroutine').mockImplementation(() => {
        });

        context.cpu.jumpToAddress(0x200)

        // When
        instruction.execute({ nnn: 0x400 })

        // Then
        expect(context.cpu.callSubroutine).toHaveBeenCalledWith(0x400)
        expect(context.cpu.getCurrentAddress()).to.equal(0x200)
    })
});