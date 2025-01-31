import { Instruction, type InstructionContext, type XNNInstructionParams } from "../instruction.ts";

export class $3XNN extends Instruction<XNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x3000, 0xF000)
    }

    execute({ x, nn: value }: XNNInstructionParams): void {
        const skipNextInstruction = this.registers.getV(x) === value

        this.cpu.goToNextInstruction({ skipNextInstruction })

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x.toString(16) + " = " + value.toString(16))
    }
}