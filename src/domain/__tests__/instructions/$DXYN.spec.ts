import { expect } from "vitest";
import { type InstructionConfig } from "../../instruction.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";
import { $DXYN } from "../../instructions/$DXYN.ts";
import { Opcode } from "../../opcode.ts";

const ALIVE_PIXEL = 1
const DEAD_PIXEL = 0

describe('DXYN : VY is subtracted from VX. Underflow is managed in VF', () => {
    let context: InstructionConfig;
    let instruction: $DXYN

    beforeEach(() => {
        context = useTestInstructionConfig()
        instruction = new $DXYN(context)
    })

    it('should match DXYN', () => {
        // Given
        const fetchedOpcode = 0xD12E

        // When
        const result = instruction.matches(new Opcode(fetchedOpcode))

        // Then
        expect(result).toBeTruthy()
    })

    it('"DXYN" should draw a non overlapping sprite of width of 8, height of N at (VX, VY)', () => {
        /*
            11000000
            11000000
         */
        const sprite = [
            0xC0,
            0xC0,
        ]

        context.cpu.jumpToAddress(0x200)
        context.registers.setV(0, 1)
        context.registers.setV(1, 1)

        context.registers.setI(0x200)

        context.memory.load(sprite)

        instruction.execute({ x: 0, y: 1, n: 2 })

        expect(context.graphics.getPixelAt({ x: 1, y: 1 })).equals(ALIVE_PIXEL)
        expect(context.graphics.getPixelAt({ x: 2, y: 1 })).equals(ALIVE_PIXEL)
        expect(context.graphics.getPixelAt({ x: 1, y: 2 })).equals(ALIVE_PIXEL)
        expect(context.graphics.getPixelAt({ x: 2, y: 2 })).equals(ALIVE_PIXEL)

        expect(context.registers.getV(0xF)).to.equal(0)

        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });

    it('"DXYN" should draw an overlapping sprite of width of 8, height of N at (VX, VY)', () => {
        /*
            11000000
            11000000
         */
        const sprite = [
            0xC0,
            0xC0,
        ]

        context.cpu.jumpToAddress(0x200)
        context.graphics.drawPixel(ALIVE_PIXEL, { x: 1, y: 1 })

        context.registers.setV(0, 1)
        context.registers.setV(1, 1)

        context.registers.setI(0x200)

        context.memory.load(sprite)

        instruction.execute({ x: 0, y: 1, n: 2 })

        expect(context.graphics.getPixelAt({ x: 1, y: 1 })).equals(DEAD_PIXEL)
        expect(context.graphics.getPixelAt({ x: 2, y: 1 })).equals(ALIVE_PIXEL)
        expect(context.graphics.getPixelAt({ x: 1, y: 2 })).equals(ALIVE_PIXEL)
        expect(context.graphics.getPixelAt({ x: 2, y: 2 })).equals(ALIVE_PIXEL)

        expect(context.registers.getV(0xF)).to.equal(1)

        expect(context.cpu.getCurrentAddress()).to.equal(0x202)
    });
});