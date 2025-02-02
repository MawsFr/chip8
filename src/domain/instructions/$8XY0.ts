import { Instruction, type InstructionConfig, type XYInstructionParams } from "../instruction.ts";

export class $8XY0 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x8000, 0xF00F, context)
    }

    execute({ x, y }: XYInstructionParams): void {
        const value = this.registers.getV(y)

        this.registers.setV(x, value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y)
    }
}