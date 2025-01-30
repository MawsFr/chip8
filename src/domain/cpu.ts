import type { Graphics } from "./graphics.ts";
import type Stack from "./stack.ts";
import type Registers from "./registers.ts";
import type Memory from "./memory.ts";
import type { Input } from "./input.ts";
import { Timer } from "./timers.ts";
import {
    extractN,
    extractNN,
    extractNNN,
    extractX,
    extractY,
    type Instruction,
    type InstructionContext,
    type InstructionParams
} from "./instruction.ts";
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
        ]
    }

    getProgramCounter() {
        return this.programCounter
    }

    setProgramCounter(address: number) {
        this.programCounter = address & 0x0FFF
    }

    goToNextInstruction() {
        this.programCounter += 2 & 0x0FFF
    }

    interpret(opcode: number) {
        const instruction = this.instructions.find((instruction) => instruction.matches(opcode))

        if (!instruction) {
            console.warn(opcode.toString(16).padStart(4, '0').toUpperCase() + " Unhandled opcode. Please verify.");
            return
        }

        // if (instruction) {
        instruction.execute({
            x: extractX(opcode),
            y: extractY(opcode),
            n: extractN(opcode),
            nn: extractNN(opcode),
            nnn: extractNNN(opcode)
        })
        // }

        if ((opcode & 0xF0FF) === 0xE0A1) { // EXA1 - Skip next instruction if key in VX is not pressed
            const x = (opcode & 0x0F00) >> 8
            const key = this.registers.getV(x)

            if (!this.input.isPressed(key)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()
            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is not pressed")
        } else if ((opcode & 0xF0FF) === 0xF007) { // FX07 - Set VX = delay timer
            const x = (opcode & 0x0F00) >> 8

            this.registers.setV(x, this.delayTimer.read())

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = delay timer")
        } else if ((opcode & 0xF0FF) === 0xF00A) { // FX0A - Wait for key press and store in VX
            const x = (opcode & 0x0F00) >> 8

            this.input.waitForPress().then((key) => {
                this.registers.setV(x, key)
                this.goToNextInstruction()
            })

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Wait for key press and store in V" + x)
        } else if ((opcode & 0xF0FF) === 0xF015) { // FX15 - Set delay timer = VX
            const x = (opcode & 0x0F00) >> 8

            this.delayTimer.write(this.registers.getV(x))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set delay timer = V" + x)
        } else if ((opcode & 0xF0FF) === 0xF018) { // FX18 - Set sound timer = VX
            const x = (opcode & 0x0F00) >> 8

            this.soundTimer.write(this.registers.getV(x))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set sound timer = V" + x)
        } else if ((opcode & 0xF0FF) === 0xF01E) { // FX1E - Set I = I + VX
            const x = (opcode & 0x0F00) >> 8

            this.registers.setI(this.registers.getI() + this.registers.getV(x))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = I + V" + x)
        } else if ((opcode & 0xF0FF) === 0xF029) { // FX29 - Set I = sprite address for VX
            const x = (opcode & 0x0F00) >> 8

            this.registers.setI(this.registers.getV(x) * 5)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = sprite address for V" + x)
        } else if ((opcode & 0xF0FF) === 0xF033) { // FX33 - Store BCD representation of VX in memory
            const x = (opcode & 0x0F00) >> 8
            const value = this.registers.getV(x)

            const hundreds = Math.floor(value / 100)
            const tens = Math.floor((value % 100) / 10)
            const ones = (value % 10)

            this.memory.load([ hundreds, tens, ones ])

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Store BCD representation of V" + x + " in memory")
        } else if ((opcode & 0xF0FF) === 0xF055) { // FX55 - Store V0 to VX in memory
            const x = (opcode & 0x0F00) >> 8

            this.memory.load(this.registers.getRange(0, x))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Store V0 to V" + x + " in memory")
        } else if ((opcode & 0xF0FF) === 0xF065) { // FX65 - Fill V0 to VX with memory values
            const x = (opcode & 0x0F00) >> 8

            for (let i = 0; i <= x; ++i) {
                this.registers.setV(i, this.memory.getDataAt(this.registers.getI() + i)) // TODO : cleanup
            }

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Fill V0 to V" + x + " with memory values")
        }
    }

    clear() {
        this.programCounter = 0x0
    }


}