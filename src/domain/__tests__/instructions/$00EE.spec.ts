import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $00EE } from "../../instructions/$00EE.ts";

describe('00EE : Return from a subroutine', () => {
    let context: InstructionContext;
    let instruction: $00EE

    beforeEach(() => {
        context = useTestContext()
        instruction = new $00EE()
    })

    it('should return from a subroutine', () => {
        // Given
        context.stack.push(0x200)
        context.cpu.setProgramCounter(0x400)

        // When
        instruction.execute({
            ...context,
        })

        // Then
        expect(context.cpu.getProgramCounter()).equals(0x202)
    })
});