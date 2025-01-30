import { Instruction, type InstructionContext, type XNNInstructionParams } from "../instruction.ts";

export class $4XNN extends Instruction<XNNInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0x4000, 0xF000)
    }

    execute({ x, nn }: XNNInstructionParams): void {
        if (this.registers.getV(x) !== nn) {
            this.cpu.goToNextInstruction()
            console.log("Next instruction skipped")
        }

        this.cpu.goToNextInstruction()
        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x.toString(16) + " != " + nn.toString(16))
    }
}