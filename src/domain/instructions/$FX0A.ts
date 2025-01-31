import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";

export class $FX0A extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF00A, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        this.input.waitForPress().then((key) => {
            this.registers.setV(x, key)

            this.cpu.goToNextInstruction()
        })

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Wait for key press and store in V" + x)
    }
}