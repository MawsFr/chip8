import { Instruction, type InstructionContext, type NNNInstructionParams } from "../instruction.ts";

export class $1NNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x1000, 0xF000)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        this.cpu.jumpToAddress(address)

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + (address).toString(16))
    }
}