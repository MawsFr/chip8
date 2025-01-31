import { Instruction, type InstructionContext, type XNNInstructionParams } from "../instruction.ts";
import { bitwiseAnd } from "../binary-operations.ts";

export class $CXNN extends Instruction<XNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xC000, 0xF000)
    }

    execute({ x, nn }: XNNInstructionParams): void {
        const randomNumber = Math.floor(Math.random() * 256)
        const value = bitwiseAnd(nn, randomNumber)

        this.registers.setV(x, value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x.toString(16) + " = " + nn.toString(16) + " & " + randomNumber)
    }
}