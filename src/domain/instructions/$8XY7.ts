import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $8XY7 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8007, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        const subtractResult = this.registers.getV(y) - this.registers.getV(x)
        this.registers.setV(0xF, Number(this.registers.getV(y) >= this.registers.getV(x)))
        this.registers.setV(x, subtractResult)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y + " - V" + x)
    }
}