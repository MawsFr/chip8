import { Instruction, type InstructionContext, type NNNInstructionParams } from "../instruction.ts";

export class $BNNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xB000, 0xF000)
    }

    execute({ nnn }: NNNInstructionParams): void {
        this.cpu.setProgramCounter(nnn + this.registers.getV(0))

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + nnn.toString(16) + " + V0")
    }
}