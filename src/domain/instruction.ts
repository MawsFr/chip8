import type { Opcode } from "./opcode.ts";
import type { Graphics } from "./graphics.ts";
import type { Cpu } from "./cpu.ts";
import type Stack from "./stack.ts";

export abstract class Instruction {
    protected readonly opcode: Opcode
    protected readonly mask: number

    protected constructor(opcode: Opcode, mask: number) {
        this.opcode = opcode
        this.mask = mask
    }

    matches(opcode: Opcode): boolean {
        return (opcode & this.mask) === this.opcode
    }

    abstract execute(params?: InstructionParams): void
}

export type InstructionParams = InstructionContext & Partial<OpcodeParams>

export type InstructionContext = {
    graphics: Graphics
    cpu: Cpu
    stack: Stack
}

export type OpcodeParams =
    | NNNInstructionParams
    | XNNInstructionParams
    | XYNInstructionParams
    | XYInstructionParams
    | XInstructionParams

export type NNNInstructionParams = {
    nnn: NNN
}

export type XNNInstructionParams = {
    x: X
    nn: NN
}

export type XYNInstructionParams = {
    x: X
    y: Y
    n: N
}

export type XYInstructionParams = {
    x: X
    y: Y
}

export type XInstructionParams = {
    x: X
}

export type NNN = number;  // Adresse sur 12 bits
export type NN = number;   // Valeur sur 8 bits
export type N = number;    // Valeur sur 4 bits
export type X = number;    // Index de registre (4 bits)
export type Y = number;    // Index de registre (4 bits)

export function extractNNN(value: number): NNN {
    return value & 0x0FFF;
}

export function extractNN(value: number): NN {
    return value & 0x00FF;
}

export function extractN(value: number): N {
    return value & 0x000F;
}

export function extractX(value: number): X {
    return (value & 0x0F00) >> 8;
}

export function extractY(value: number): Y {
    return (value & 0x00F0) >> 4;
}



