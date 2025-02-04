import { Instruction, type InstructionConfig, type XYNInstructionParams } from "../instruction.ts";
import { type Position } from "../sprite.ts";

export class $DXYN extends Instruction<XYNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xD000, 0xF000, context)
    }

    execute({ x, y, n: height }: XYNInstructionParams): void {
        const sprite = this.memory.getSprite(height)
        const position: Position = {
            x: this.registers.getV(x),
            y: this.registers.getV(y)
        }

        const { wasOverlapping } = this.graphics.drawSprite(sprite, position)

        this.registers.setV(0xF, Number(wasOverlapping))

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Draw sprite at V" + x + ": " + this.registers.getV(x).toString(16) + " V" + y + ": " + this.registers.getV(y).toString(16) + " with height " + height, this.cpu)
    }
}