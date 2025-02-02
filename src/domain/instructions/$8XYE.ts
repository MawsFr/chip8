import { Instruction, type InstructionConfig, type XInstructionParams } from "../instruction.ts";

export class $8XYE extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x800E, 0xF00F, context)
    }

    execute({ x }: XInstructionParams): void {
        this.registers.shiftLeft(x)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " << 1")
    }
}