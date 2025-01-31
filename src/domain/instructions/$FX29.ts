import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export const FONT_HEIGHT = 5

export class $FX29 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF029, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const fontAddress = this.registers.getV(x) * FONT_HEIGHT

        this.registers.setI(fontAddress)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = font sprite address for V" + x)
    }
}