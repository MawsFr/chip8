import { Instruction, type InstructionConfig } from "./instruction.ts";

/**
 * Clear the screen
 */
export class $00E0 extends Instruction<undefined> {
    constructor(context: InstructionConfig) {
        super(0x00E0, 0xFFFF, context)
    }

    execute(): void {
        this.graphics.clearScreen()

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Clear screen", this.cpu)
    }
}