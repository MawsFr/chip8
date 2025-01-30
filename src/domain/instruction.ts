import type { Opcode } from "./opcode.ts";
import type { Graphics } from "./graphics.ts";
import type { Cpu } from "./cpu.ts";
import type Stack from "./stack.ts";
import type Registers from "./registers.ts";
import type Memory from "./memory.ts";
import type { Input } from "./input.ts";
import type { Timer } from "./timers.ts";

export abstract class Instruction<T extends InstructionParams> {
    protected readonly context: InstructionContext
    protected readonly opcode: Opcode
    protected readonly mask: number

    protected constructor(context: InstructionContext, opcode: Opcode, mask: number) {
        this.context = context
        this.opcode = opcode
        this.mask = mask
    }

    get cpu(): Cpu {
        return this.context.cpu
    }

    get graphics(): Graphics {
        return this.context.graphics
    }

    get stack(): Stack {
        return this.context.stack
    }

    get registers(): Registers {
        return this.context.registers
    }

    matches(opcode: Opcode): boolean {
        return (opcode & this.mask) === this.opcode
    }

    abstract execute(params?: T): void
}

export type InstructionContext = {
    graphics: Graphics
    cpu: Cpu
    stack: Stack
    registers: Registers
    memory: Memory
    input: Input
    delayTimer: Timer
    soundTimer: Timer,
}

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

export type InstructionParams =
    | NNNInstructionParams
    | XNNInstructionParams
    | XYNInstructionParams
    | XYInstructionParams
    | XInstructionParams
    | undefined

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



