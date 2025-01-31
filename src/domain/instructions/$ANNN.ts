import { Instruction, type InstructionContext, type NNNInstructionParams } from "../instruction.ts";

export class $ANNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xA000, 0xF000)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        this.registers.setI(address)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = " + address.toString(16))
    }
}