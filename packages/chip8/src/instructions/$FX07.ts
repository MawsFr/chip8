import { Instruction, type InstructionConfig, type XInstructionParams } from "./instruction.ts";

/**
 * Set VX = delay timer value
 */
export class $FX07 extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xF007, 0xF0FF, context)
    }

    execute({ x }: XInstructionParams): void {
        const value = this.delayTimer.read()

        this.registers.setV(x, value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = delay timer", this.cpu)
    }
}