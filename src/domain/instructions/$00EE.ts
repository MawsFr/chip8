import { Instruction, type InstructionParams } from "../instruction.ts";

export class $00EE extends Instruction {
    constructor() {
        super(0x00EE, 0xFFFF)
    }

    execute({ cpu, stack }: InstructionParams): void {
        cpu.setProgramCounter(stack.pop())
        cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Returns from a subroutine")
    }
}