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
    type N,
    type NN,
    type NNN,
    type X,
    type Y
} from "./instruction.ts";
import { $00E0 } from "./instructions/$00E0.ts";
import { $00EE } from "./instructions/$00EE.ts";

export class Cpu {
    public graphics: Graphics;
    public stack: Stack;
    public registers: Registers;
    public programCounter: number = 0x0; // TODO: cleanup
    public memory: Memory;
    public input: Input
    public delayTimer: Timer
    public soundTimer: Timer;

    public instructions: Instruction[] = []

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

    loadInstructions() {
        this.instructions = [
            new $00E0(),
            new $00EE()
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
        const x: X = extractX(opcode)
        const y: Y = extractY(opcode)
        const n: N = extractN(opcode)
        const nn: NN = extractNN(opcode)
        const nnn: NNN = extractNNN(opcode)

        const instruction = this.instructions.find((instruction) => instruction.matches(opcode))

        if (!instruction) {
            console.warn(opcode.toString(16).padStart(4, '0').toUpperCase() + " Unhandled opcode. Please verify.");
            return
        }

        instruction.execute({ cpu: this, graphics: this.graphics, stack: this.stack, x, y, n, nn, nnn })

        if ((opcode & 0xF000) === 0x1000) { // 1NNN - Jump to address
            this.setProgramCounter(opcode & 0x0FFF)
            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + (opcode & 0x0FFF).toString(16))
        } else if ((opcode & 0xF000) === 0x2000) { // 2NNN - Call subroutine
            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Calls subroutine at " + (opcode & 0x0FFF).toString(16) + " and saves return address " + this.getProgramCounter().toString(16))
            this.stack.push(this.getProgramCounter())
            this.setProgramCounter(opcode & 0x0FFF)
        } else if ((opcode & 0xF000) === 0x3000) { // 3XNN - Skip next instruction if VX = NN
            const address = opcode & 0x00FF
            const register = (opcode & 0x0F00) >> 8

            if (address === this.registers.getV(register)) {
                this.goToNextInstruction()
                console.log("Next instruction skipped")
            }

            this.goToNextInstruction()
            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + register.toString(16) + " = " + address.toString(16))
        } else if ((opcode & 0xF000) === 0x4000) { // 4XNN - Skip next instruction if VX != NN
            const address = opcode & 0x00FF
            const register = (opcode & 0x0F00) >> 8

            if (address !== this.registers.getV(register)) {
                this.goToNextInstruction()
                console.log("Next instruction skipped")
            }

            this.goToNextInstruction()
            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + register.toString(16) + " != " + address.toString(16))
        } else if ((opcode & 0xF00F) === 0x5000) { // 5XY0 - Skip next instruction if VX = VY
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4

            if (this.registers.getV(x) === this.registers.getV(y)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()
            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " = V" + y)
        } else if ((opcode & 0xF000) === 0x6000) { // 6XNN - Set VX = NN
            const address = opcode & 0x00FF
            const register = (opcode & 0x0F00) >> 8
            this.registers.setV(register, address)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + register.toString(16) + " = " + address.toString(16))
        } else if ((opcode & 0xF000) === 0x7000) { // 7XNN - Add NN to VX
            const address = opcode & 0x00FF
            const register = (opcode & 0x0F00) >> 8
            this.registers.addV(register, address)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Add " + address.toString(16) + " to V" + register.toString(16))
        } else if ((opcode & 0xF00F) === 0x8000) { // 8XY0 - Set VX = VY
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(y))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y)
        } else if ((opcode & 0xF00F) === 0x8001) { // 8XY1 - Set VX = VX | VY
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) | this.registers.getV(y))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " | V" + y)
        } else if ((opcode & 0xF00F) === 0x8002) { // 8XY2 - Set VX = VX & VY
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) & this.registers.getV(y))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " & V" + y)
        } else if ((opcode & 0xF00F) === 0x8003) { // 8XY3 - Set VX = VX ^ VY
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4
            this.registers.setV(x, this.registers.getV(x) ^ this.registers.getV(y))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " ^ V" + y)
        } else if ((opcode & 0xF00F) === 0x8004) { // 8XY4 - Add VY to VX
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4

            const addResult = this.registers.getV(x) + this.registers.getV(y)
            this.registers.setV(x, addResult & 0x00FF)
            this.registers.setV(0xF, addResult >> 8)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " + V" + y)
        } else if ((opcode & 0xF00F) === 0x8005) { // 8XY5 - Subtract VY from VX
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4

            const subtractResult = this.registers.getV(x) - this.registers.getV(y)
            this.registers.setV(0xF, Number(this.registers.getV(x) >= this.registers.getV(y)))
            this.registers.setV(x, subtractResult & 0x00FF)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " - V" + y)
        } else if ((opcode & 0xF00F) === 0x8006) { // 8XY6 - Shift VX right by 1
            const x = (opcode & 0x0F00) >> 8

            this.registers.setV(0xF, this.registers.getV(x) & 0x01)
            this.registers.setV(x, this.registers.getV(x) >> 0x1)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " >> 1")
        } else if ((opcode & 0xF00F) === 0x8007) { // 8XY7 - Set VX = VY - VX
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4

            const subtractResult = this.registers.getV(y) - this.registers.getV(x)
            this.registers.setV(0xF, Number(this.registers.getV(y) >= this.registers.getV(x)))
            this.registers.setV(x, subtractResult & 0x00FF)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + y + " - V" + x)
        } else if ((opcode & 0xF00F) === 0x800E) { // 8XYE - Shift VX left by 1
            const x = (opcode & 0x0F00) >> 8

            this.registers.setV(0xF, (this.registers.getV(x) & 0x80) >> 7)
            this.registers.setV(x, this.registers.getV(x) << 0x1)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + x + " = V" + x + " << 1")
        } else if ((opcode & 0xF00F) === 0x9000) { // 9XY0 - Skip next instruction if VX != VY
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4

            if (this.registers.getV(x) !== this.registers.getV(y)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if V" + x + " != V" + y)
        } else if ((opcode & 0xF000) === 0xA000) { // ANNN - Set I = NNN
            const address = opcode & 0x0FFF

            this.registers.setI(address)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set I = " + address.toString(16))
        } else if ((opcode & 0xF000) === 0xB000) { // BNNN - Jump to address NNN + V0
            const address = opcode & 0x0FFF

            this.setProgramCounter(address + this.registers.getV(0))

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Jump to address " + address.toString(16) + " + V0")
        } else if ((opcode & 0xF000) === 0xC000) { // CXNN - Set VX = random byte & NN
            const randomNumber = Math.floor(Math.random() * 256)
            const address = opcode & 0x00FF
            const register = (opcode & 0x0F00) >> 8

            this.registers.setV(register, address & randomNumber)

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Set V" + register.toString(16) + " = " + address.toString(16) + " & " + randomNumber)
        } else if ((opcode & 0xF000) === 0xD000) { // DXYN - Draw sprite at VX, VY with height N
            const x = (opcode & 0x0F00) >> 8
            const y = (opcode & 0x00F0) >> 4
            const n = (opcode & 0x000F)

            const sprite = this.memory.getSprite(n)

            const { wasOverlapping } = this.graphics.drawSprite(this.registers.getV(x), this.registers.getV(y), sprite)

            this.registers.setV(0xF, Number(wasOverlapping))

            this.goToNextInstruction()

            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Draw sprite at V" + x + ": " + this.registers.getV(x).toString(16) + " V" + y + ": " + this.registers.getV(y).toString(16) + " with height " + n)
        } else if ((opcode & 0xF0FF) === 0xE09E) { // EX9E - Skip next instruction if key in VX is pressed
            const x = (opcode & 0x0F00) >> 8
            const key = this.registers.getV(x)

            if (this.input.isPressed(key)) {
                this.goToNextInstruction()
            }

            this.goToNextInstruction()
            console.log(opcode.toString(16).padStart(4, '0').toUpperCase() + " Skip next instruction if key in V" + x + " is pressed")
        } else if ((opcode & 0xF0FF) === 0xE0A1) { // EXA1 - Skip next instruction if key in VX is not pressed
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