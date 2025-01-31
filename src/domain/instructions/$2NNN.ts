import { Instruction, type InstructionContext, type NNNInstructionParams } from "../instruction.ts";

export class $2NNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x2000, 0xF000)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Calling subroutine at " + (address).toString(16) + " and saves return address " + this.cpu.getCurrentAddress().toString(16))

        this.cpu.callSubroutine(address)
    }
}