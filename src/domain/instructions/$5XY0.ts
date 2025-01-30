import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $5XY0 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x5000, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        if (this.registers.getV(x) === this.registers.getV(y)) {
            this.cpu.goToNextInstruction()
        }

        this.cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " = V" + y)
    }
}