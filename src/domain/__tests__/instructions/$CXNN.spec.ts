import { expect } from "vitest";
import { type InstructionContext } from "../../instruction.ts";
import { useTestContext } from "../helpers/useTestContext.ts";
import { $CXNN } from "../../instructions/$CXNN.ts";

describe('CXNN : Jump to address NNN', () => {
    let context: InstructionContext;
    let instruction: $CXNN

    beforeEach(() => {
        context = useTestContext()
        instruction = new $CXNN(context)
    })

    it('should match CXNN', () => {
        // Given
        const fetchedOpcode = 0xC20A

        // When
        const result = instruction.matches(fetchedOpcode)

        // Then
        expect(result).toBeTruthy()
    })

    it('"CXNN" should set VX to a random number & NN', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.1)
        context.cpu.setProgramCounter(0x200)

        instruction.execute({ x: 0, nn: 0x10 })

        expect(context.registers.getV(0)).to.equal(0x10)
        expect(context.cpu.getProgramCounter()).to.equal(0x202)
    });
});