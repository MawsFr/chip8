import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX55 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF055, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const registers = this.registers.entries(0, x)

        this.memory.load(registers)

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Store V0 to V" + x + " in memory")
    }
}