import { Instruction, type InstructionContext, type XNNInstructionParams } from "../instruction.ts";

export class $6XNN extends Instruction<XNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x6000, 0xF000)
    }

    execute({ x, nn }: XNNInstructionParams): void {
        this.registers.setV(x, nn)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x.toString(16) + " = " + nn.toString(16))
    }
}