import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX29 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF029, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        this.registers.setI(this.registers.getV(x) * 5)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = sprite address for V" + x)
    }
}