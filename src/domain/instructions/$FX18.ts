import { Instruction, type InstructionConfig, type XInstructionParams } from "../instruction.ts";

export class $FX18 extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xF018, 0xF0FF, context)
    }

    execute({ x }: XInstructionParams): void {
        const value = this.registers.getV(x)

        this.soundTimer.write(value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set sound timer = V" + x, this.cpu)
    }
}