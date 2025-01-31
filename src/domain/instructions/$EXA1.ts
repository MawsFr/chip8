import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $EXA1 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xE0A1, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const key = this.registers.getV(x)
        const skipNextInstruction = !this.input.isPressed(key)

        this.cpu.goToNextInstruction({ skipNextInstruction })

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is not pressed")
    }
}