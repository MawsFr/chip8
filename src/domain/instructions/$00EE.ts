import { Instruction, type InstructionContext } from "../instruction.ts";

export class $00EE extends Instruction {
    constructor(context: InstructionContext) {
        super(0x00EE, 0xFFFF, context)
    }

    execute(): void {
        this.context.cpu.setProgramCounter(this.context.stack.pop())
        this.context.cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Returns from a subroutine")
    }
}