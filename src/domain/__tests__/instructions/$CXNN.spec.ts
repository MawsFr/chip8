import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/useTestInstructionConfig.ts";
import { $CXNN } from "../../instructions/$CXNN.ts";
import { Opcode } from "../../opcode.ts";

describe('CXNN : Jump to address NNN', () => {
    let context: InstructionConfig;
    let instruction: $CXNN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $CXNN(context)
    })

    it('should match CXNN', () => {
        // Given
        const fetchedOpcode = 0xC20A

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"CXNN" should set VX to a random number & NN', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.1)
        context.cpu.jumpToAddress(0x200)

        instruction.execute({ x: 0, nn: 0x10 })

        expect(context.registers.getV(0)).to.equal(0x10)
        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});