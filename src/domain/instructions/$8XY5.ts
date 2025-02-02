import { Instruction, type InstructionConfig, type XYInstructionParams } from "../instruction.ts";

export class $8XY5 extends Instruction<XYInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0x8005, 0xF00F, context)
    }

    execute({ x, y }: XYInstructionParams): void {
        this.registers.subtract({
            resultDestinationIndex: x,
            minuendIndex: x,
            subtrahendIndex: y
        })

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " - V" + y)
    }
}