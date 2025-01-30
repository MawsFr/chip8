import { Cpu } from "./cpu.ts";
import { Graphics } from "./graphics.ts";
import Stack from "./stack.ts";
import Registers from "./registers.ts";
import Memory from "./memory.ts";
import { Input } from "./input.ts";
import { Timer } from "./timers.ts";
import { BinaryOperations } from "./binary-operations.ts";

export enum State {
    OFF = 'OFF',
    ROM_LOADED = 'ROM_LOADED',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED'
}

export class Emulator {
    public graphics: Graphics
    public stack: Stack
    public registers: Registers
    public memory: Memory
    public input: Input
    public delayTimer: Timer
    public soundTimer: Timer
    public cpu: Cpu;

    public lastOpcode: number = 0
    public state: State = State.OFF


    constructor(cpu: Cpu, graphics: Graphics, stack: Stack, registers: Registers, memory: Memory, input: Input, delayTimer: Timer, soundTimer: Timer) {
        this.cpu = cpu
        this.graphics = graphics
        this.stack = stack
        this.registers = registers
        this.memory = memory
        this.input = input
        this.delayTimer = delayTimer
        this.soundTimer = soundTimer
        this.lastOpcode = this.readNextOpcode()
    }

    loadROM(data: Uint8Array) {
        this.memory.load(data, 0x200)
        this.cpu.setProgramCounter(0x200)
        this.lastOpcode = this.readNextOpcode()
        this.state = State.ROM_LOADED
    }

    run(manual: boolean) {
        this.state = State.RUNNING
        const fps = 60;
        const fpsInterval = 1000 / fps;

        if (manual) {
            return
        }

        const intervalId = setInterval(() => {
            if (this.state !== State.RUNNING) {
                clearInterval(intervalId);
                return;
            }

            this.executeNextInstruction();
            this.executeNextInstruction();
            this.executeNextInstruction();
            this.executeNextInstruction();
        }, fpsInterval);
    }

    public executeNextInstruction() {
        const opcode = this.readNextOpcode();
        this.cpu.interpret(opcode);
        this.updateTimers();

        this.lastOpcode = opcode
    }

    readNextOpcode() {
        const left = this.memory.getDataAt(this.cpu.getProgramCounter())
        const right = this.memory.getDataAt(this.cpu.getProgramCounter() + 1)

        return BinaryOperations.concatBytes(left, right)
    }

    updateTimers() {
        this.delayTimer.tick()
        this.soundTimer.tick()
    }

    restart(rom: Uint8Array) {
        this.memory.clear()
        this.graphics.clearScreen()
        this.stack.clear()
        this.registers.clear()
        this.cpu.clear()
        this.input.clear()
        this.delayTimer.write(0)
        this.soundTimer.write(0)
        this.state = State.OFF
        this.lastOpcode = 0
        this.loadROM(rom)
    }
}