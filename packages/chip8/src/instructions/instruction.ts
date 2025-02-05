import type { N, NN, NNNAddress, Opcode, RegisterIndex } from "../opcode.ts";
import type { Graphics } from "../graphics.ts";
import type { Cpu } from "../cpu.ts";
import type { Stack } from "../stack.ts";
import type { Registers } from "../registers.ts";
import type { Memory } from "../memory.ts";
import type { Input } from "../input.ts";
import type { Timer } from "../timers.ts";

export abstract class Instruction<T extends InstructionParams> {
    protected readonly cpu: Cpu
    protected readonly graphics: Graphics
    protected readonly stack: Stack
    protected readonly registers: Registers
    protected readonly memory: Memory
    protected readonly input: Input
    protected readonly delayTimer: Timer
    protected readonly soundTimer: Timer
    protected readonly opcode: OpcodeIdentifier
    protected readonly mask: number

    protected constructor(opcode: OpcodeIdentifier, mask: number, config: InstructionConfig) {
        this.cpu = config.cpu
        this.graphics = config.graphics
        this.stack = config.stack
        this.registers = config.registers
        this.memory = config.memory
        this.input = config.input
        this.delayTimer = config.delayTimer
        this.soundTimer = config.soundTimer
        this.opcode = opcode
        this.mask = mask
    }

    matches(opcode: Opcode): boolean {
        return (opcode.value & this.mask) === this.opcode
    }

    abstract execute(params?: T): void
}

export type OpcodeIdentifier = number;

export type InstructionConfig = {
    cpu: Cpu
    graphics: Graphics
    stack: Stack
    registers: Registers
    memory: Memory
    input: Input
    delayTimer: Timer
    soundTimer: Timer,
}

export type NNNInstructionParams = {
    nnn: NNNAddress
}

export type XNNInstructionParams = {
    x: RegisterIndex
    nn: NN
}

export type XYNInstructionParams = {
    x: RegisterIndex
    y: RegisterIndex
    n: N
}

export type XYInstructionParams = {
    x: RegisterIndex
    y: RegisterIndex
}

export type XInstructionParams = {
    x: RegisterIndex
}

export type InstructionParams =
    | NNNInstructionParams
    | XNNInstructionParams
    | XYNInstructionParams
    | XYInstructionParams
    | XInstructionParams
    | undefined

