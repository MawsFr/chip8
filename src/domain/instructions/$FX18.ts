import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX18 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF018, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        this.soundTimer.write(this.registers.getV(x))

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set sound timer = V" + x)
    }
}