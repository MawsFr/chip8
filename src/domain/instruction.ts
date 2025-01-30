import type { Opcode } from "./opcode.ts";
import type { Graphics } from "./graphics.ts";
import type { Cpu } from "./cpu.ts";
import type Stack from "./stack.ts";
import type Registers from "./registers.ts";
import type Memory from "./memory.ts";
import type { Input } from "./input.ts";
import type { Timer } from "./timers.ts";

export abstract class Instruction<T extends InstructionContext | NNNInstructionParams | XNNInstructionParams | XYNInstructionParams | XYInstructionParams | XInstructionParams> {
    protected readonly opcode: Opcode
    protected readonly mask: number

    protected constructor(opcode: Opcode, mask: number) {
        this.opcode = opcode
        this.mask = mask
    }

    matches(opcode: Opcode): boolean {
        return (opcode & this.mask) === this.opcode
    }

    abstract execute(params?: T): void
}

export type OpcodeParams = {
    opcode: {
        value?: Opcode
    }
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

export type NNNInstructionParams = InstructionContext & OpcodeParams & {
    opcode: {
        params: {
            nnn: NNN
        }
    }
}

export type XNNInstructionParams = InstructionContext & OpcodeParams & {
    opcode: {
        params: {
            x: X
            nn: NN
        }
    }
}

export type XYNInstructionParams = InstructionContext & OpcodeParams & {
    opcode: {
        params: {
            x: X
            y: Y
            n: N
        }
    }
}

export type XYInstructionParams = InstructionContext & OpcodeParams & {
    opcode: {
        params: {
            x: X
            y: Y
        }
    }
}

export type XInstructionParams = InstructionContext & OpcodeParams & {
    opcode: {
        params: {
            x: X
        }
    }
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



