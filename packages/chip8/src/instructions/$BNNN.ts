import { Instruction, type InstructionConfig, type NNNInstructionParams } from "./instruction.ts";

export class $BNNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xB000, 0xF000, context)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        const addressToJumpTo = this.registers.getV(0) + address

        this.cpu.jumpToAddress(addressToJumpTo)

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + address.toString(16) + " + V0", this.cpu)
    }
}