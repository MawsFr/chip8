import { Instruction, type InstructionContext, type NNNInstructionParams } from "../instruction.ts";

export class $BNNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xB000, 0xF000)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        const addressToJumpTo = this.registers.getV(0) + address

        this.cpu.jumpToAddress(addressToJumpTo)

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + address.toString(16) + " + V0")
    }
}