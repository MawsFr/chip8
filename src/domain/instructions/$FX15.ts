import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX15 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF015, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        this.delayTimer.write(this.registers.getV(x))

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set delay timer = V" + x)
    }
}