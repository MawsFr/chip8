import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $8XY4 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8004, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        const addResult = this.registers.getV(x) + this.registers.getV(y)
        this.registers.setV(x, addResult)
        this.registers.setV(0xF, addResult >> 8)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " + V" + y)
    }
}