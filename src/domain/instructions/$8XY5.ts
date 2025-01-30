import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $8XY5 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8005, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        const subtractResult = this.registers.getV(x) - this.registers.getV(y)
        this.registers.setV(0xF, Number(this.registers.getV(x) >= this.registers.getV(y)))
        this.registers.setV(x, subtractResult)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " - V" + y)
    }
}