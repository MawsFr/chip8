import { Instruction, type InstructionContext, type XNNInstructionParams } from "../instruction.ts";

export class $7XNN extends Instruction<XNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x7000, 0xF000)
    }

    execute({ x, nn }: XNNInstructionParams): void {
        this.registers.addV(x, nn)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Add " + nn.toString(16) + " to V" + x.toString(16))
    }
}