import { Graphics } from "./graphics.ts";
import { Stack } from "./stack.ts";
import { Registers } from "./registers.ts";
import { Memory } from "./memory.ts";
import { Input } from "./input.ts";
import { Timer } from "./timers.ts";
import { Instruction, type InstructionConfig, type InstructionParams } from "./instructions";
import { type NNNAddress, Opcode } from "./opcode.ts";
import { InstructionLoader } from "./instructions/";
import { bitwiseAnd } from "@mawsfr/binary-operations";

export const NB_OPCODE_BYTES = 2

export type CpuConfig = {
    graphics: Graphics;
    stack: Stack;
    registers: Registers;
    memory: Memory;
    input: Input;
    delayTimer: Timer;
    soundTimer: Timer;
};

export type GoToNextInstructionParams = {
    skipNextInstruction: boolean
};

export class Cpu {
    private readonly graphics: Graphics;
    private readonly stack: Stack;
    private readonly registers: Registers;
    private programCounter: number = 0x0; // // TODO: move in registers
    private readonly memory: Memory;
    private readonly input: Input
    private readonly delayTimer: Timer
    private readonly soundTimer: Timer;

    public readonly instructions: Instruction<InstructionParams>[] = []

    constructor(config: CpuConfig) {
        this.graphics = config.graphics
        this.stack = config.stack
        this.registers = config.registers
        this.memory = config.memory
        this.input = config.input
        this.delayTimer = config.delayTimer
        this.soundTimer = config.soundTimer
        this.instructions = InstructionLoader.loadInstructions(this.context)
    }

    get context(): InstructionConfig {
        return {
            cpu: this,
            graphics: this.graphics,
            stack: this.stack,
            registers: this.registers,
            memory: this.memory,
            input: this.input,
            delayTimer: this.delayTimer,
            soundTimer: this.soundTimer,
        }
    }

    getCurrentAddress() {
        return bitwiseAnd(this.programCounter, 0x0FFF)
    }

    jumpToAddress(address: number) {
        this.programCounter = bitwiseAnd(address, 0x0FFF)
    }

    goToNextInstruction({ skipNextInstruction }: GoToNextInstructionParams = { skipNextInstruction: false }) {
        const skip = skipNextInstruction ? NB_OPCODE_BYTES : 0

        this.jumpToAddress(this.getCurrentAddress() + NB_OPCODE_BYTES + skip)
    }

    callSubroutine(address: NNNAddress) {
        this.stack.push(this.programCounter)
        this.jumpToAddress(address)
    }

    returnFromSubroutine() {
        this.jumpToAddress(this.stack.pop())
    }

    interpret(opcode: Opcode) {
        console.log(opcode.toString())
        const instruction = this.findMatchingInstruction(opcode)

        if (!instruction) {
            console.warn(opcode.toString() + " Unhandled opcode. Please verify.");
            return
        }

        instruction.execute({
            x: opcode.extractX(),
            y: opcode.extractY(),
            n: opcode.extractN(),
            nn: opcode.extractNN(),
            nnn: opcode.extractNNN(),
        })
    }

    private findMatchingInstruction(opcode: Opcode) {
        return this.instructions.find((instruction) => instruction.matches(opcode));
    }

    reset() {
        this.jumpToAddress(0x0)
    }
}