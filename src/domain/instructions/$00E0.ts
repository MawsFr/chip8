import { Instruction, type InstructionContext } from "../instruction.ts";

export class $00E0 extends Instruction<InstructionContext> {
    constructor() {
        super(0x00E0, 0xFFFF)
    }

    execute({ graphics, cpu }: InstructionContext): void {
        graphics.clearScreen()
        cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Clear screen")
    }
}