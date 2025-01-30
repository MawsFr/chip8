import { afterEach, expect, vi } from "vitest";
import { Instruction, type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $00E0 } from "../../instructions/$00E0.ts";

describe('00E0 : Clear screen', () => {
    let context: InstructionContext;
    let instruction: Instruction

    beforeEach(() => {
        context = useTestContext()
        instruction = new $00E0()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should clear the screen', () => {
        vi.spyOn(context.graphics, 'clearScreen').mockImplementation(() => {
        });

        context.cpu.setProgramCounter(0x200)
        instruction.execute({
            ...context,
        })

        expect(context.graphics.clearScreen).toHaveBeenCalledOnce()
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    })
});