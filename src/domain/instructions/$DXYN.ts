import { Instruction, type InstructionContext, type XYNInstructionParams } from "../instruction.ts";

export class $DXYN extends Instruction<XYNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xD000, 0xF000)
    }

    execute({ x, y, n }: XYNInstructionParams): void {
        const sprite = this.memory.getSprite(n)

        const { wasOverlapping } = this.graphics.drawSprite(this.registers.getV(x), this.registers.getV(y), sprite)

        this.registers.setV(0xF, Number(wasOverlapping))

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Draw sprite at V" + x + ": " + this.registers.getV(x).toString(16) + " V" + y + ": " + this.registers.getV(y).toString(16) + " with height " + n)
    }
}