import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $8XYE extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x800E, 0xF00F)
    }

    execute({ x }: XInstructionParams): void {
        this.registers.shiftLeft(x)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " << 1")
    }
}