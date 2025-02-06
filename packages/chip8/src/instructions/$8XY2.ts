import { Instruction, type InstructionConfig, type XYInstructionParams } from "./instruction.ts";
import { bitwiseAnd } from "@mawsfr/binary-operations";

/**
 * Set VX = VX AND VY.
 */
export class $8XY2 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x8002, 0xF00F, context)
    }

    execute({ x, y }: XYInstructionParams): void {
        const xAndY = bitwiseAnd(this.registers.getV(x), this.registers.getV(y))

        this.registers.setV(x, xAndY)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " & V" + y, this.cpu)
    }
}