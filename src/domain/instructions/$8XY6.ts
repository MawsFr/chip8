import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $8XY6 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8006, 0xF00F)
    }

    execute({ x }: XYInstructionParams): void {
        this.registers.setV(0xF, this.registers.getV(x) & 0x01)
        this.registers.setV(x, this.registers.getV(x) >> 0x1)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " >> 1")
    }
}