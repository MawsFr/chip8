import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX07 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF007, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const value = this.delayTimer.read()

        this.registers.setV(x, value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = delay timer")
    }
}