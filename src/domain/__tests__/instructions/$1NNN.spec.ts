import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $1NNN } from "../../instructions/$1NNN.ts";

describe('1NNN : Jump to address NNN', () => {
    let context: InstructionContext;
    let instruction: $1NNN

    beforeEach(() => {
        context = useTestContext()
        instruction = new $1NNN(context)
    })

    it('should jump to address', () => {
        // When
        instruction.execute({
            nnn: 0x20A
        })

        // Then
        expect(context.cpu.getProgramCounter()).to.equal(0x20A)
    })
});