import { Instruction, type InstructionContext, type NNNInstructionParams } from "../instruction.ts";

export class $2NNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x2000, 0xF000)
    }

    execute({ nnn }: NNNInstructionParams): void {
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Calls subroutine at " + (nnn).toString(16) + " and saves return address " + this.cpu.getProgramCounter().toString(16))
        this.stack.push(this.cpu.getProgramCounter())
        this.cpu.setProgramCounter(nnn)
    }
}