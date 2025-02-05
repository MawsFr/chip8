import { Instruction, type InstructionConfig } from "./instruction.ts";

export class $00EE extends Instruction<undefined> {
    constructor(context: InstructionConfig) {
        super(0x00EE, 0xFFFF, context)
    }

    execute(): void {
        this.cpu.returnFromSubroutine()

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Returns from a subroutine", this.cpu)
    }
}