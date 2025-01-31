import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";
import { bitwiseOr } from "../binary-operations.ts";

export class $8XY1 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8001, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        const xOrY = bitwiseOr(this.registers.getV(x), this.registers.getV(y))

        this.registers.setV(x, xOrY)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " | V" + y)
    }
}