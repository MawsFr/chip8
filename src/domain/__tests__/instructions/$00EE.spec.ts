import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $00EE } from "../../instructions/$00EE.ts";

describe('00EE : Return from a subroutine', () => {
    let context: InstructionContext;
    let instruction: $00EE

    beforeEach(() => {
        context = useTestContext()
        instruction = new $00EE(context)
    })

    it('should match 00EE', () => {
        // Given
        const fetchedOpcode = 0x00EE

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('should return from a subroutine', () => {
        // Given
        context.stack.push(0x200)
        context.cpu.setProgramCounter(0x400)

        // When
        instruction.execute()

        // Then
        expect(context.cpu.getProgramCounter()).equals(0x202)
    })
});