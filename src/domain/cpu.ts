import type { Graphics } from "./graphics.ts";
import type Stack from "./stack.ts";
import type Registers from "./registers.ts";
import type Memory from "./memory.ts";
import type { Input } from "./input.ts";
import { Timer } from "./timers.ts";

export class Cpu {
    public graphics: Graphics;
    public stack: Stack;
    public registers: Registers;
    public programCounter: number = 0x0;
    public memory: Memory;
    public input: Input
    public delayTimer: Timer
    public soundTimer: Timer;

    constructor(graphics: Graphics, stack: Stack, registers: Registers, memory: Memory, input: Input, delayTimer: Timer, soundTimer: Timer) {
        this.graphics = graphics
        this.stack = stack
        this.registers = registers
        this.memory = memory
        this.input = input
        this.delayTimer = delayTimer
        this.soundTimer = soundTimer
    }

    getProgramCounter() {
        return this.programCounter
    }

    setProgramCounter(address: number) {
        this.programCounter = address
    }

    incrementProgramCounter() {
        this.programCounter++
    }

    interpret(number: number) {
        if ((number & 0xFFFF) === 0x00E0) {
            this.graphics.clearScreen()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Clear screen")
        } else if ((number & 0xFFFF) === 0x00EE) {
            this.setProgramCounter(this.stack.pop())
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Returns from a subroutine")
        } else if ((number & 0xF000) === 0x1000) {
            this.setProgramCounter(number & 0x0FFF)
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + (number & 0x0FFF))
        } else if ((number & 0xF000) === 0x2000) {
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Calls subroutine at " + (number & 0x0FFF) + " and saves return address " + this.getProgramCounter())
            this.stack.push(this.getProgramCounter())
            this.setProgramCounter(number & 0x0FFF)
        } else if ((number & 0xF000) === 0x3000) {
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8

            if (address === this.registers.getV(register)) {
                this.programCounter += 2
            }
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + register + " = " + address)
        } else if ((number & 0xF000) === 0x4000) {
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8

            if (address !== this.registers.getV(register)) {
                this.programCounter += 2
            }

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + register + " != " + address)
        } else if ((number & 0xF00F) === 0x5000) {
            const x = (number & 0x00F0) >> 4
            const y = (number & 0x0F00) >> 8

            if (this.registers.getV(x) === this.registers.getV(y)) {
                this.programCounter += 2
            }

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " = V" + y)
        } else if ((number & 0xF000) === 0x6000) {
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8
            this.registers.setV(register, address)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + register + " = " + address)
        } else if ((number & 0xF000) === 0x7000) {
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8
            this.registers.addV(register, address)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Add " + address + " to V" + register)
        } else if ((number & 0xF00F) === 0x8000) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(y))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y)
        } else if ((number & 0xF00F) === 0x8001) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) | this.registers.getV(y))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " | V" + y)
        } else if ((number & 0xF00F) === 0x8002) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) & this.registers.getV(y))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " & V" + y)
        } else if ((number & 0xF00F) === 0x8003) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) ^ this.registers.getV(y))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " ^ V" + y)
        } else if ((number & 0xF00F) === 0x8004) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            const addResult = this.registers.getV(x) + this.registers.getV(y)
            this.registers.setV(x, addResult & 0x00FF)
            this.registers.setV(0xF, addResult >> 8)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " + V" + y)
        } else if ((number & 0xF00F) === 0x8005) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            const subtractResult = this.registers.getV(x) - this.registers.getV(y)
            this.registers.setV(0xF, Number(this.registers.getV(x) >= this.registers.getV(y)))
            this.registers.setV(x, subtractResult & 0x00FF)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " - V" + y)
        } else if ((number & 0xF00F) === 0x8006) {
            const x = (number & 0x0F00) >> 8

            this.registers.setV(0xF, this.registers.getV(x) & 0x01)
            this.registers.setV(x, this.registers.getV(x) >> 0x1)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " >> 1")
        } else if ((number & 0xF00F) === 0x8007) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            const subtractResult = this.registers.getV(y) - this.registers.getV(x)
            this.registers.setV(0xF, Number(this.registers.getV(y) >= this.registers.getV(x)))
            this.registers.setV(x, subtractResult & 0x00FF)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y + " - V" + x)
        } else if ((number & 0xF00F) === 0x800E) {
            const x = (number & 0x0F00) >> 8

            this.registers.setV(0xF, (this.registers.getV(x) & 0x80) >> 7)
            this.registers.setV(x, this.registers.getV(x) << 0x1)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " << 1")
        } else if ((number & 0xF00F) === 0x9000) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            if (this.registers.getV(x) !== this.registers.getV(y)) {
                this.programCounter += 2
            }

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " != V" + y)
        } else if ((number & 0xF000) === 0xA000) {
            const address = number & 0x0FFF

            this.registers.setI(address)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set I = " + address)
        } else if ((number & 0xF000) === 0xB000) {
            const address = number & 0x0FFF

            this.setProgramCounter(address + this.registers.getV(0))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + address + " + V0")
        } else if ((number & 0xF000) === 0xC000) {
            const randomNumber = Math.floor(Math.random() * 256)
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8

            this.registers.setV(register, address & randomNumber)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + register + " = " + address + " & " + randomNumber)
        } else if ((number & 0xF000) === 0xD000) {
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            const n = (number & 0x000F)

            const sprite = this.memory.getSprite(n)

            const { wasOverlapping } = this.graphics.drawSprite(this.registers.getV(x), this.registers.getV(y), sprite)

            this.registers.setV(0xF, Number(wasOverlapping))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Draw sprite at V" + x + " V" + y + " with height " + n)
        } else if ((number & 0xF0FF) === 0xE09E) {
            const x = (number & 0x0F00) >> 8
            const key = this.registers.getV(x)

            if (this.input.isPressed(key)) {
                this.programCounter += 2
            }

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is pressed")
        } else if ((number & 0xF0FF) === 0xE0A1) {
            const x = (number & 0x0F00) >> 8
            const key = this.registers.getV(x)

            if (!this.input.isPressed(key)) {
                this.programCounter += 2
            }

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is not pressed")
        } else if ((number & 0xF0FF) === 0xF007) {
            const x = (number & 0x0F00) >> 8

            this.registers.setV(x, this.delayTimer.read())

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = delay timer")
        } else if ((number & 0xF0FF) === 0xF015) {
            const x = (number & 0x0F00) >> 8

            this.delayTimer.write(this.registers.getV(x))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set delay timer = V" + x)
        } else if ((number & 0xF0FF) === 0xF018) {
            const x = (number & 0x0F00) >> 8

            this.soundTimer.write(this.registers.getV(x))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set sound timer = V" + x)
        } else if ((number & 0xF0FF) === 0xF01E) {
            const x = (number & 0x0F00) >> 8

            this.registers.setI(this.registers.getI() + this.registers.getV(x))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set I = I + V" + x)
        } else if ((number & 0xF0FF) === 0xF029) {
            const x = (number & 0x0F00) >> 8

            this.registers.setI(this.registers.getV(x) * 5)

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set I = sprite address for V" + x)
        } else if ((number & 0xF0FF) === 0xF033) {
            const x = (number & 0x0F00) >> 8
            const value = this.registers.getV(x)

            const hundreds = value / 100
            const tens = (value % 100) / 10
            const ones = (value % 10)

            this.memory.load([ hundreds, tens, ones ])

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Store BCD representation of V" + x + " in memory")
        } else if ((number & 0xF0FF) === 0xF055) {
            const x = (number & 0x0F00) >> 8

            this.memory.load(this.registers.getRange(0, x))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Store V0 to V" + x + " in memory")
        } else if ((number & 0xF0FF) === 0xF065) {
            const x = (number & 0x0F00) >> 8

            for (let i = 0; i <= x; ++i) {
                this.registers.setV(i, this.memory.getDataAt(this.registers.getI() + i)) // TODO : cleanup
            }

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Fill V0 to V" + x + " with memory values")
        } else {
            console.warn(number.toString(16).padStart(4, '0').toUpperCase() + " Unhandled opcode. Please verify.");
        }
    }


}