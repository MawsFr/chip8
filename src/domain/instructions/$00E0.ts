import { Instruction, type InstructionContext } from "../instruction.ts";

export class $00E0 extends Instruction<InstructionContext> {
    constructor(context: InstructionContext) {
        super(0x00E0, 0xFFFF, context)
    }

    execute(): void {
        this.context.graphics.clearScreen()
        this.context.cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Clear screen")
    }
}