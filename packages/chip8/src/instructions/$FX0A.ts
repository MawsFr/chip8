import { Instruction, type InstructionConfig, type XInstructionParams } from "./instruction.ts";

/**
 * Wait for a key press and store the result in register VX
 */
export class $FX0A extends Instruction<XInstructionParams> {
    constructor(context: InstructionConfig) {
        super(0xF00A, 0xF0FF, context)
    }

    execute({ x }: XInstructionParams): void {
        this.input.waitForPress().then((key) => {
            this.registers.setV(x, key)

            this.cpu.goToNextInstruction()
        })

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Wait for key press and store in V" + x, this.cpu)
    }
}