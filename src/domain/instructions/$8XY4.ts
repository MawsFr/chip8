import { Instruction, type InstructionContext, type XYInstructionParams } from "../instruction.ts";

export class $8XY4 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x8004, 0xF00F)
    }

    execute({ x, y }: XYInstructionParams): void {
        const value = this.registers.getV(y)
        
        this.registers.addV(x, value, { carryFlag: true })

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " + V" + y)
    }
}