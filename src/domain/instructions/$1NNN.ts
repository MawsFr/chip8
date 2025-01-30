import { Instruction, type NNNInstructionParams } from "../instruction.ts";

export class $1NNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(0x1000, 0xF000, context)
    }

    execute({ nnn }: NNNInstructionParams): void {
        this.context.cpu.setProgramCounter(nnn)
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + (nnn).toString(16))
    }
}