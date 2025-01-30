import { Instruction, type InstructionContext } from "../instruction.ts";

export class $00EE extends Instruction<undefined> {
    constructor(context: InstructionContext) {
        super(context, 0x00EE, 0xFFFF)
    }

    execute(): void {
        this.cpu.setProgramCounter(this.stack.pop())
        this.cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Returns from a subroutine")
    }
}