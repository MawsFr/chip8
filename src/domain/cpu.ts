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
    public programCounter: number = 0x0; // TODO: cleanup
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
        this.programCounter = address & 0x0FFF
    }

    goToNextInstruction() {
        this.programCounter += 2 & 0x0FFF
    }

    interpret(number: number) {
        if ((number & 0xFFFF) === 0x00E0) { // 0NNN - Clear screen
            this.graphics.clearScreen()
            this.goToNextInstruction()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Clear screen")
        } else if ((number & 0xFFFF) === 0x00EE) { // 00EE - Return from subroutine
            this.setProgramCounter(this.stack.pop())
            this.goToNextInstruction()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Returns from a subroutine")
        } else if ((number & 0xF000) === 0x1000) { // 1NNN - Jump to address
            this.setProgramCounter(number & 0x0FFF)
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + (number & 0x0FFF))
        } else if ((number & 0xF000) === 0x2000) { // 2NNN - Call subroutine
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Calls subroutine at " + (number & 0x0FFF) + " and saves return address " + this.getProgramCounter())
            this.stack.push(this.getProgramCounter())
            this.setProgramCounter(number & 0x0FFF)
        } else if ((number & 0xF000) === 0x3000) { // 3XNN - Skip next instruction if VX = NN
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8

            if (address === this.registers.getV(register)) {
                this.goToNextInstruction()
                console.log("Next instruction skipped")
            }

            this.goToNextInstruction()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + register + " = " + address)
        } else if ((number & 0xF000) === 0x4000) { // 4XNN - Skip next instruction if VX != NN
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8

            if (address !== this.registers.getV(register)) {
                this.goToNextInstruction()
                console.log("Next instruction skipped")
            }

            this.goToNextInstruction()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + register + " != " + address)
        } else if ((number & 0xF00F) === 0x5000) { // 5XY0 - Skip next instruction if VX = VY
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            if (this.registers.getV(x) === this.registers.getV(y)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " = V" + y)
        } else if ((number & 0xF000) === 0x6000) { // 6XNN - Set VX = NN
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8
            this.registers.setV(register, address)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + register + " = " + address)
        } else if ((number & 0xF000) === 0x7000) { // 7XNN - Add NN to VX
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8
            this.registers.addV(register, address)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Add " + address + " to V" + register)
        } else if ((number & 0xF00F) === 0x8000) { // 8XY0 - Set VX = VY
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(y))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y)
        } else if ((number & 0xF00F) === 0x8001) { // 8XY1 - Set VX = VX | VY
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) | this.registers.getV(y))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " | V" + y)
        } else if ((number & 0xF00F) === 0x8002) { // 8XY2 - Set VX = VX & VY
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) & this.registers.getV(y))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " & V" + y)
        } else if ((number & 0xF00F) === 0x8003) { // 8XY3 - Set VX = VX ^ VY
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) ^ this.registers.getV(y))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " ^ V" + y)
        } else if ((number & 0xF00F) === 0x8004) { // 8XY4 - Add VY to VX
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            const addResult = this.registers.getV(x) + this.registers.getV(y)
            this.registers.setV(x, addResult & 0x00FF)
            this.registers.setV(0xF, addResult >> 8)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " + V" + y)
        } else if ((number & 0xF00F) === 0x8005) { // 8XY5 - Subtract VY from VX
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            const subtractResult = this.registers.getV(x) - this.registers.getV(y)
            this.registers.setV(0xF, Number(this.registers.getV(x) >= this.registers.getV(y)))
            this.registers.setV(x, subtractResult & 0x00FF)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " - V" + y)
        } else if ((number & 0xF00F) === 0x8006) { // 8XY6 - Shift VX right by 1
            const x = (number & 0x0F00) >> 8

            this.registers.setV(0xF, this.registers.getV(x) & 0x01)
            this.registers.setV(x, this.registers.getV(x) >> 0x1)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " >> 1")
        } else if ((number & 0xF00F) === 0x8007) { // 8XY7 - Set VX = VY - VX
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            const subtractResult = this.registers.getV(y) - this.registers.getV(x)
            this.registers.setV(0xF, Number(this.registers.getV(y) >= this.registers.getV(x)))
            this.registers.setV(x, subtractResult & 0x00FF)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y + " - V" + x)
        } else if ((number & 0xF00F) === 0x800E) { // 8XYE - Shift VX left by 1
            const x = (number & 0x0F00) >> 8

            this.registers.setV(0xF, (this.registers.getV(x) & 0x80) >> 7)
            this.registers.setV(x, this.registers.getV(x) << 0x1)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " << 1")
        } else if ((number & 0xF00F) === 0x9000) { // 9XY0 - Skip next instruction if VX != VY
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4

            if (this.registers.getV(x) !== this.registers.getV(y)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " != V" + y)
        } else if ((number & 0xF000) === 0xA000) { // ANNN - Set I = NNN
            const address = number & 0x0FFF

            this.registers.setI(address)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set I = " + address)
        } else if ((number & 0xF000) === 0xB000) { // BNNN - Jump to address NNN + V0
            const address = number & 0x0FFF

            this.setProgramCounter(address + this.registers.getV(0))

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + address + " + V0")
        } else if ((number & 0xF000) === 0xC000) { // CXNN - Set VX = random byte & NN
            const randomNumber = Math.floor(Math.random() * 256)
            const address = number & 0x00FF
            const register = (number & 0x0F00) >> 8

            this.registers.setV(register, address & randomNumber)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + register + " = " + address + " & " + randomNumber)
        } else if ((number & 0xF000) === 0xD000) { // DXYN - Draw sprite at VX, VY with height N
            const x = (number & 0x0F00) >> 8
            const y = (number & 0x00F0) >> 4
            const n = (number & 0x000F)

            const sprite = this.memory.getSprite(n)

            const { wasOverlapping } = this.graphics.drawSprite(this.registers.getV(x), this.registers.getV(y), sprite)

            this.registers.setV(0xF, Number(wasOverlapping))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Draw sprite at V" + x + ": " + this.registers.getV(x) + " V" + y + ": " + this.registers.getV(y) + " with height " + n)
        } else if ((number & 0xF0FF) === 0xE09E) { // EX9E - Skip next instruction if key in VX is pressed
            const x = (number & 0x0F00) >> 8
            const key = this.registers.getV(x)

            if (this.input.isPressed(key)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is pressed")
        } else if ((number & 0xF0FF) === 0xE0A1) { // EXA1 - Skip next instruction if key in VX is not pressed
            const x = (number & 0x0F00) >> 8
            const key = this.registers.getV(x)

            if (!this.input.isPressed(key)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()
            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is not pressed")
        } else if ((number & 0xF0FF) === 0xF007) { // FX07 - Set VX = delay timer
            const x = (number & 0x0F00) >> 8

            this.registers.setV(x, this.delayTimer.read())

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = delay timer")
        } else if ((number & 0xF0FF) === 0xF00A) { // FX0A - Wait for key press and store in VX
            const x = (number & 0x0F00) >> 8

            this.input.waitForPress().then((key) => {
                this.registers.setV(x, key)
                this.goToNextInstruction()
            })

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Wait for key press and store in V" + x)
        } else if ((number & 0xF0FF) === 0xF015) { // FX15 - Set delay timer = VX
            const x = (number & 0x0F00) >> 8

            this.delayTimer.write(this.registers.getV(x))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set delay timer = V" + x)
        } else if ((number & 0xF0FF) === 0xF018) { // FX18 - Set sound timer = VX
            const x = (number & 0x0F00) >> 8

            this.soundTimer.write(this.registers.getV(x))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set sound timer = V" + x)
        } else if ((number & 0xF0FF) === 0xF01E) { // FX1E - Set I = I + VX
            const x = (number & 0x0F00) >> 8

            this.registers.setI(this.registers.getI() + this.registers.getV(x))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set I = I + V" + x)
        } else if ((number & 0xF0FF) === 0xF029) { // FX29 - Set I = sprite address for VX
            const x = (number & 0x0F00) >> 8

            this.registers.setI(this.registers.getV(x) * 5)

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Set I = sprite address for V" + x)
        } else if ((number & 0xF0FF) === 0xF033) { // FX33 - Store BCD representation of VX in memory
            const x = (number & 0x0F00) >> 8
            const value = this.registers.getV(x)

            const hundreds = Math.floor(value / 100)
            const tens = Math.floor((value % 100) / 10)
            const ones = (value % 10)

            this.memory.load([ hundreds, tens, ones ])

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Store BCD representation of V" + x + " in memory")
        } else if ((number & 0xF0FF) === 0xF055) { // FX55 - Store V0 to VX in memory
            const x = (number & 0x0F00) >> 8

            this.memory.load(this.registers.getRange(0, x))

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Store V0 to V" + x + " in memory")
        } else if ((number & 0xF0FF) === 0xF065) { // FX65 - Fill V0 to VX with memory values
            const x = (number & 0x0F00) >> 8

            for (let i = 0; i <= x; ++i) {
                this.registers.setV(i, this.memory.getDataAt(this.registers.getI() + i)) // TODO : cleanup
            }

            this.goToNextInstruction()

            console.log(number.toString(16).padStart(4, '0').toUpperCase() + " Fill V0 to V" + x + " with memory values")
        } else { // Unhandled opcode
            console.warn(number.toString(16).padStart(4, '0').toUpperCase() + " Unhandled opcode. Please verify.");
        }
    }

    clear() {
        this.programCounter = 0x0
    }


}