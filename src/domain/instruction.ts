import type { N, NN, NNN, Opcode, X, Y } from "./opcode.ts";
import type { Graphics } from "./graphics.ts";
import type { Cpu } from "./cpu.ts";
import type Stack from "./stack.ts";
import type Registers from "./registers.ts";
import type Memory from "./memory.ts";
import type { Input } from "./input.ts";
import type { Timer } from "./timers.ts";

export abstract class Instruction<T extends InstructionParams> {
    protected readonly context: InstructionContext
    protected readonly opcode: OpcodeIdentifier
    protected readonly mask: number

    protected constructor(context: InstructionContext, opcode: OpcodeIdentifier, mask: number) {
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

    get memory(): Memory {
        return this.context.memory
    }

    get input(): Input {
        return this.context.input
    }

    get delayTimer(): Timer {
        return this.context.delayTimer
    }

    get soundTimer(): Timer {
        return this.context.soundTimer
    }

    matches(opcode: Opcode): boolean {
        return (opcode.value & this.mask) === this.opcode
    }

    abstract execute(params?: T): void
}

export type OpcodeIdentifier = number;

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



