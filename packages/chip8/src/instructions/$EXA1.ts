import { Instruction, type InstructionConfig, type XInstructionParams } from "./instruction.ts";

/**
 * Skip next instruction if key in VX is not pressed
 */
export class $EXA1 extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xE0A1, 0xF0FF, context)
    }

    execute({ x }: XInstructionParams): void {
        const key = this.registers.getV(x)
        const skipNextInstruction = !this.input.isPressed(key)

        this.cpu.goToNextInstruction({ skipNextInstruction })

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is not pressed", this.cpu)
    }
}