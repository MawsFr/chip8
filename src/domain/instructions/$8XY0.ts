import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $8XY0 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8000, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        this.registers.setV(x, this.registers.getV(y))

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y)
    }
}