import { Instruction, type InstructionConfig, type XInstructionParams } from "./instruction.ts";

/**
 * Loads V0 to VX (including VX) with memory values starting at address I.
 * I is set to I + X + 1 after operation
 */
export class $FX65 extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xF065, 0xF0FF, context)
    }

    execute({ x }: XInstructionParams): void {
        const start = this.registers.getI()
        const entries = this.memory.entries(start, start + x)

        this.registers.load(entries)
        this.registers.addI(x + 1)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Fill V0 to V" + x + " with memory values", this.cpu)
    }
}