import { Instruction, type InstructionConfig, type XYInstructionParams } from "../instruction.ts";

export class $8XY6 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x8006, 0xF00F, context)
    }

    execute({ x }: XYInstructionParams): void {
        this.registers.shiftRight(x)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " >> 1", this.cpu)
    }
}