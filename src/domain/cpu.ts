import type { Graphics } from "./graphics.ts";
import type Stack from "./stack.ts";
import type Registers from "./registers.ts";
import type Memory from "./memory.ts";
import type { Input } from "./input.ts";
import { Timer } from "./timers.ts";
import { type Instruction, type InstructionContext, type InstructionParams } from "./instruction.ts";
import { $00E0 } from "./instructions/$00E0.ts";
import { $00EE } from "./instructions/$00EE.ts";
import { $1NNN } from "./instructions/$1NNN.ts";
import { $2NNN } from "./instructions/$2NNN.ts";
import { $3XNN } from "./instructions/$3XNN.ts";
import { $4XNN } from "./instructions/$4XNN.ts";
import { $5XY0 } from "./instructions/$5XY0.ts";
import { $6XNN } from "./instructions/$6XNN.ts";
import { $7XNN } from "./instructions/$7XNN.ts";
import { $8XY0 } from "./instructions/$8XY0.ts";
import { $8XY1 } from "./instructions/$8XY1.ts";
import { $8XY2 } from "./instructions/$8XY2.ts";
import { $8XY3 } from "./instructions/$8XY3.ts";
import { $8XY4 } from "./instructions/$8XY4.ts";
import { $8XY5 } from "./instructions/$8XY5.ts";
import { $8XY6 } from "./instructions/$8XY6.ts";
import { $8XY7 } from "./instructions/$8XY7.ts";
import { $8XYE } from "./instructions/$8XYE.ts";
import { $9XY0 } from "./instructions/$9XY0.ts";
import { $ANNN } from "./instructions/$ANNN.ts";
import { $BNNN } from "./instructions/$BNNN.ts";
import { $CXNN } from "./instructions/$CXNN.ts";
import { $DXYN } from "./instructions/$DXYN.ts";
import { $EX9E } from "./instructions/$EX9E.ts";
import { $EXA1 } from "./instructions/$EXA1.ts";
import { $FX07 } from "./instructions/$FX07.ts";
import { $FX0A } from "./instructions/$FX0A.ts";
import { $FX15 } from "./instructions/$FX15.ts";
import { $FX18 } from "./instructions/$FX18.ts";
import { $FX1E } from "./instructions/$FX1E.ts";
import { $FX29 } from "./instructions/$FX29.ts";
import { $FX33 } from "./instructions/$FX33.ts";
import { $FX55 } from "./instructions/$FX55.ts";
import { $FX65 } from "./instructions/$FX65.ts";
import { type NNNAddress, Opcode } from "./opcode.ts";

type GoToNextInstructionParams = {
    skipNextInstruction: boolean
};

export const NB_OPCODE_BYTES = 2

export class Cpu {
    public graphics: Graphics;
    public stack: Stack;
    public registers: Registers;
    public programCounter: number = 0x0; // TODO: cleanup
    public memory: Memory;
    public input: Input
    public delayTimer: Timer
    public soundTimer: Timer;

    public instructions: Instruction<InstructionParams>[] = []

    constructor(graphics: Graphics, stack: Stack, registers: Registers, memory: Memory, input: Input, delayTimer: Timer, soundTimer: Timer) {
        this.graphics = graphics
        this.stack = stack
        this.registers = registers
        this.memory = memory
        this.input = input
        this.delayTimer = delayTimer
        this.soundTimer = soundTimer

        this.loadInstructions()
    }

    get context(): InstructionContext {
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

    loadInstructions() {
        this.instructions = [
            new $00E0(this.context),
            new $00EE(this.context),
            new $1NNN(this.context),
            new $2NNN(this.context),
            new $3XNN(this.context),
            new $4XNN(this.context),
            new $5XY0(this.context),
            new $6XNN(this.context),
            new $7XNN(this.context),
            new $8XY0(this.context),
            new $8XY1(this.context),
            new $8XY2(this.context),
            new $8XY3(this.context),
            new $8XY4(this.context),
            new $8XY5(this.context),
            new $8XY6(this.context),
            new $8XY7(this.context),
            new $8XYE(this.context),
            new $9XY0(this.context),
            new $ANNN(this.context),
            new $BNNN(this.context),
            new $CXNN(this.context),
            new $DXYN(this.context),
            new $EX9E(this.context),
            new $EXA1(this.context),
            new $FX07(this.context),
            new $FX0A(this.context),
            new $FX15(this.context),
            new $FX18(this.context),
            new $FX1E(this.context),
            new $FX29(this.context),
            new $FX33(this.context),
            new $FX55(this.context),
            new $FX65(this.context),
        ]
    }

    getCurrentAddress() {
        return this.programCounter
    }

    jumpToAddress(address: number) {
        this.programCounter = address & 0x0FFF
    }

    goToNextInstruction({ skipNextInstruction }: GoToNextInstructionParams = { skipNextInstruction: false }) {
        const skip = Number(skipNextInstruction) * NB_OPCODE_BYTES

        this.programCounter += NB_OPCODE_BYTES + skip
    }

    callSubroutine(address: NNNAddress) {
        this.stack.push(this.programCounter)
        this.jumpToAddress(address)
    }

    returnFromSubroutine() {
        this.programCounter = this.stack.pop()
    }

    interpret(opcode: Opcode) {
        const instruction = this.instructions.find((instruction) => instruction.matches(opcode))

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

    reset() {
        this.programCounter = 0x0
    }
}