import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $9XY0 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x9000, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        const skipNextInstruction = this.registers.getV(x) !== this.registers.getV(y)

        this.cpu.goToNextInstruction({ skipNextInstruction })

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " != V" + y)
    }
}