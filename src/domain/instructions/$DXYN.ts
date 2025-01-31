import { Instruction, type InstructionContext, type XYNInstructionParams } from "../instruction.ts";
import { type Position, Sprite } from "../sprite.ts";

export class $DXYN extends Instruction<XYNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xD000, 0xF000)
    }

    execute({ x, y, n: height }: XYNInstructionParams): void {
        const spriteData = this.memory.getSpriteData(height)
        const position: Position = {
            x: this.registers.getV(x),
            y: this.registers.getV(y)
        }

        const { wasOverlapping } = this.graphics.drawSprite(new Sprite(spriteData, position))

        this.registers.setV(0xF, Number(wasOverlapping))

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Draw sprite at V" + x + ": " + this.registers.getV(x).toString(16) + " V" + y + ": " + this.registers.getV(y).toString(16) + " with height " + height)
    }
}