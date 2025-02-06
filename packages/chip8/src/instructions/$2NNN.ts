import { Instruction, type InstructionConfig, type NNNInstructionParams } from "./instruction.ts";

/**
 * Calls subroutine at NNN
 */
export class $2NNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x2000, 0xF000, context)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Before Calling subroutine at " + (address).toString(16) + " and saves return address " + this.cpu.getCurrentAddress().toString(16), this.cpu)

        this.cpu.callSubroutine(address)

        console.log('After calling subroutine', this.cpu)
    }
}