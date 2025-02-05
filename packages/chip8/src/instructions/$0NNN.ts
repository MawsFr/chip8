import { Instruction, type InstructionConfig, type NNNInstructionParams } from "./instruction.ts";

export class $0NNN extends Instruction<NNNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x0000, 0xF000, context)
    }

    execute(): void {
        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " NOP", this.cpu)
    }
}