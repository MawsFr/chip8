import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";
import { bitwiseXor } from "../binary-operations.ts";

export class $8XY3 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8003, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        const xXorY = bitwiseXor(this.registers.getV(x), this.registers.getV(y))

        this.registers.setV(x, xXorY)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " ^ V" + y)
    }
}