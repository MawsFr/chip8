import { Instruction, type InstructionConfig, type XYInstructionParams } from "./instruction.ts";
import { bitwiseOr } from "@mawsfr/binary-operations";

/**
 * Set VX = VX OR VY
 */
export class $8XY1 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x8001, 0xF00F, context)
    }

    execute({ x, y }: XYInstructionParams): void {
        const xOrY = bitwiseOr(this.registers.getV(x), this.registers.getV(y))

        this.registers.setV(x, xOrY)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " | V" + y, this.cpu)
    }
}