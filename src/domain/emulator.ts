import { Cpu } from "./cpu.ts";
import { Graphics } from "./graphics.ts";
import Stack from "./stack.ts";
import Registers from "./registers.ts";
import Memory from "./memory.ts";
import { Input } from "./input.ts";
import { Timer } from "./timers.ts";
import { concatBytes } from "./binary-operations.ts";
import { Opcode } from "./opcode.ts";

export enum State {
    OFF = 'OFF',
    ROM_LOADED = 'ROM_LOADED',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED'
}

export const MAX_CYCLES_PER_FRAME = 4

export class Emulator {
    public graphics: Graphics
    public stack: Stack
    public registers: Registers
    public memory: Memory
    public input: Input
    public delayTimer: Timer
    public soundTimer: Timer
    public cpu: Cpu;

    public lastOpcode: Opcode | null = null
    public state: State = State.OFF
    public intervalId: number | null = null


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
        this.reset()
        this.memory.load(data, 0x200)
        this.cpu.jumpToAddress(0x200)
        this.lastOpcode = this.readNextOpcode()
        this.state = State.ROM_LOADED
    }

    run(manual: boolean = false) {
        this.state = State.RUNNING

        if (manual) {
            return
        }

        const fps = 60;
        const fpsInterval = 1000 / fps;

        this.intervalId = setInterval(() => {
            if (this.state !== State.RUNNING && this.intervalId) {
                clearInterval(this.intervalId);
                return;
            }

            for (let i = 0; i < MAX_CYCLES_PER_FRAME; i++) {
                this.executeNextInstruction()
            }
        }, fpsInterval);
    }

    public executeNextInstruction() {
        const opcode = this.readNextOpcode();
        this.cpu.interpret(opcode);
        this.updateTimers();

        this.lastOpcode = opcode
    }

    readNextOpcode(): Opcode {
        const left = this.memory.getDataAt(this.cpu.getCurrentAddress())
        const right = this.memory.getDataAt(this.cpu.getCurrentAddress() + 1)

        return new Opcode(concatBytes(left, right))
    }

    updateTimers() {
        this.delayTimer.tick()
        this.soundTimer.tick()
    }

    reset() {
        this.memory.reset()
        this.graphics.clearScreen()
        this.stack.reset()
        this.registers.reset()
        this.cpu.reset()
        this.input.reset()
        this.delayTimer.reset()
        this.soundTimer.reset()
        this.state = State.OFF
        this.lastOpcode = null
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}