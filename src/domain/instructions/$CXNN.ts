import { Instruction, type InstructionConfig, type XNNInstructionParams } from "../instruction.ts";

export class $CXNN extends Instruction<XNNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xC000, 0xF000, context)
    }

    execute({ x, nn }: XNNInstructionParams): void {
        this.registers.randomize(x, nn)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x.toString(16) + " = " + nn.toString(16) + " & " + this.registers.getV(x).toString(16), this.cpu)
    }
}