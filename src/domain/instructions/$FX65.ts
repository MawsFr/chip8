import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX65 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF065, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        for (let i = 0; i <= x; ++i) {
            this.registers.setV(i, this.memory.getDataAt(this.registers.getI() + i)) // TODO : cleanup
        }

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Fill V0 to V" + x + " with memory values")
    }
}