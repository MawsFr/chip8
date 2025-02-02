import { Instruction, type InstructionConfig, type NNNInstructionParams } from "../instruction.ts";

export class $1NNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x1000, 0xF000, context)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        this.cpu.jumpToAddress(address)

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + (address).toString(16))
    }
}