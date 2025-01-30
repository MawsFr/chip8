import { Instruction, type InstructionParams } from "../instruction.ts";

export class $00E0 extends Instruction {
    constructor() {
        super(0x00E0, 0xFFFF)
    }

    execute({ graphics, cpu }: InstructionParams): void {
        graphics.clearScreen()
        cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Clear screen")
    }
}