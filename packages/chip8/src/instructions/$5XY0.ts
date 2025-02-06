import { Instruction, type InstructionConfig, type XYInstructionParams } from "./instruction.ts";

/**
 * Skip next instruction if VX = VY.
 */
export class $5XY0 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x5000, 0xF00F, context)
    }

    execute({ x, y }: XYInstructionParams): void {
        const skipNextInstruction = this.registers.getV(x) === this.registers.getV(y)

        this.cpu.goToNextInstruction({ skipNextInstruction })

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " = V" + y, this.cpu)
    }
}