import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $EX9E extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xE09E, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const key = this.registers.getV(x)

        if (this.input.isPressed(key)) {
            this.cpu.goToNextInstruction()
        }

        this.cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is pressed")
    }
}