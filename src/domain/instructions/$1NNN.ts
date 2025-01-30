import { Instruction, type NNNInstructionParams } from "../instruction.ts";

export class $1NNN extends Instruction<NNNInstructionParams> {
    constructor() {
        super(0x1000, 0xF000)
    }

    execute({ cpu, opcode }: NNNInstructionParams): void {
        cpu.setProgramCounter(opcode.params.nnn)
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + (opcode.params.nnn).toString(16))
    }
}