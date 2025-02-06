import { Instruction, type InstructionConfig, type XInstructionParams } from "./instruction.ts";

/**
 * Store from V0 to VX in memory starting at address I
 * I is set to I + X + 1 after operation
 */
export class $FX55 extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xF055, 0xF0FF, context)
    }

    execute({ x }: XInstructionParams): void {
        const registers = this.registers.entries(0, x)

        this.memory.load(registers)
        this.registers.addI(x + 1)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Store V0 to V" + x + " in memory", this.cpu)
    }
}