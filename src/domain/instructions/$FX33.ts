import { Instruction, type InstructionContext, type XInstructionParams } from "../instruction.ts";
import { extractHundreds, extractOnes, extractTens } from "../math.helper.ts";

export class $FX33 extends Instruction<XInstructionParams> {
    constructor(context: InstructionContext) {
        super(context, 0xF033, 0xF0FF)
    }

    execute({ x }: XInstructionParams): void {
        const value = this.registers.getV(x)

        const hundreds = extractHundreds(value)
        const tens = extractTens(value)
        const ones = extractOnes(value)

        this.memory.load([ hundreds, tens, ones ])

        this.cpu.goToNextInstruction()

        console.log(this.opcode.toString(16).padStart(4, '0').toUpperCase() + " Store BCD representation of V" + x + " in memory")
    }
}