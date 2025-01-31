import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX18 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF018, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const value = this.registers.getV(x)
        
        this.soundTimer.write(value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set sound timer = V" + x)
    }
}