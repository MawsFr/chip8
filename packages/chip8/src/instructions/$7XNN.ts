import { Instruction, type InstructionConfig, type XNNInstructionParams } from "./instruction.ts";

export class $7XNN extends Instruction<XNNInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x7000, 0xF000, context)
    }

    execute({ x, nn: value }: XNNInstructionParams): void {
        this.registers.addV(x, value)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Add " + value.toString(16) + " to V" + x.toString(16), this.cpu)
    }
}