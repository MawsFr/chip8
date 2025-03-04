import { Instruction, type InstructionConfig, type XYInstructionParams } from "./instruction.ts";

/**
 * Set VX = VY - VX, set VF = NOT borrow.
 */
export class $8XY7 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x8007, 0xF00F, context)
    }

    execute({ x, y }: XYInstructionParams): void {
        this.registers.subtract({
            resultDestinationIndex: x,
            minuendIndex: y,
            subtrahendIndex: x
        })

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y + " - V" + x, this.cpu)
    }
}