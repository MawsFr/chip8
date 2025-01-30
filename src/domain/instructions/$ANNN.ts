import { Instruction, type InstructionContext, type NNNInstructionParams } from "../instruction.ts";

export class $ANNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xA000, 0xF000)
    }

    execute({ nnn }: NNNInstructionParams): void {
        this.registers.setI(nnn)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = " + nnn.toString(16))
    }
}