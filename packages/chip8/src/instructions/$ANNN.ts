import { Instruction, type InstructionConfig, type NNNInstructionParams } from "./instruction.ts";

export class $ANNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xA000, 0xF000, context)
    }

    execute({ nnn: address }: NNNInstructionParams): void {
        this.registers.setI(address)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = " + address.toString(16), this.cpu)
    }
}