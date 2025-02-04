import { Instruction, type InstructionConfig } from "../instruction.ts";

export class $0000 extends Instruction<undefined> {
    constructor(context: InstructionConfig) {
        super(0x0000, 0xFFFF, context)
    }

    execute(): void {
        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " NOP", this.cpu)
    }
}