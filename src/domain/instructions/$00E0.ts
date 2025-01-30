import { Instruction, type InstructionContext } from "../instruction.ts";

export class $00E0 extends Instruction<undefined> {
    constructor(context: InstructionContext) {
        super(context, 0x00E0, 0xFFFF)
    }

    execute(): void {
        this.graphics.clearScreen()
        this.cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Clear screen")
    }
}