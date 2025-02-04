import { Instruction, type InstructionConfig, type XInstructionParams } from "../instruction.ts";

export const FONT_HEIGHT = 5

export class $FX29 extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xF029, 0xF0FF, context)
    }

    execute({ x }: XInstructionParams): void {
        const fontAddress = this.registers.getV(x) * FONT_HEIGHT

        this.registers.setI(fontAddress)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = font sprite address for V" + x, this.cpu)
    }
}