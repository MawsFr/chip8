import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX1E extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF01E, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const value = this.registers.getV(x)
        
        this.registers.addI(value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = I + V" + x)
    }
}