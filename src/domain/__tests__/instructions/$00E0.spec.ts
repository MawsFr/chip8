import { afterEach, expect, vi } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $00E0 } from "../../instructions/$00E0.ts";

describe('00E0 : Clear screen', () => {
    let context: InstructionContext;
    let instruction: $00E0

    beforeEach(() => {
        context = useTestContext()
        instruction = new $00E0(context)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should clear the screen', () => {
        // Given
        vi.spyOn(context.graphics, 'clearScreen').mockImplementation(() => {
        });

        context.cpu.setProgramCounter(0x200)

        // When
        instruction.execute()

        // Then
        expect(context.graphics.clearScreen).toHaveBeenCalledOnce()
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    })
});