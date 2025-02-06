import { Cpu } from "./cpu.ts";
import { Graphics } from "./graphics.ts";
import { Stack } from "./stack.ts";
import { Registers } from "./registers.ts";
import { Memory } from "./memory.ts";
import { Input } from "./input.ts";
import { Timer } from "./timers.ts";
import { concatBytes } from "@mawsfr/binary-operations";
import { Opcode } from "./opcode.ts";

export const MAX_CYCLES_PER_FRAME = 10
export const FRAME_PER_SECOND = 60
export const MS_PER_SECOND = 1000

export type EmulatorConfig = {
    cpu: Cpu;
    graphics: Graphics;
    stack: Stack;
    registers: Registers;
    memory: Memory;
    input: Input;
    delayTimer: Timer;
    soundTimer: Timer;
}

export enum State {
    OFF = 'OFF',
    ROM_LOADED = 'ROM_LOADED',
    RUNNING = 'RUNNING',
}

export class Emulator {
    public cpu: Cpu;
    public graphics: Graphics
    public stack: Stack
    public registers: Registers
    public memory: Memory
    public input: Input
    public delayTimer: Timer
    public soundTimer: Timer

    public lastOpcode: Opcode | null = null
    public state: State = State.OFF
    public intervalId: ReturnType<typeof setInterval> | null = null;

    constructor(config: EmulatorConfig) {
        this.cpu = config.cpu
        this.graphics = config.graphics
        this.stack = config.stack
        this.registers = config.registers
        this.memory = config.memory
        this.input = config.input
        this.delayTimer = config.delayTimer
        this.soundTimer = config.soundTimer
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

        const fpsInterval = MS_PER_SECOND / FRAME_PER_SECOND;

        this.intervalId = setInterval(() => {
            if (this.state !== State.RUNNING && this.intervalId) {
                clearInterval(this.intervalId);
                return;
            }

            for (let i = 0; i < MAX_CYCLES_PER_FRAME; i++) {
                this.executeNextInstruction()
            }

            this.updateTimers();
        }, fpsInterval);
    }

    public executeNextInstruction() {
        const opcode = this.readNextOpcode();

        this.cpu.interpret(opcode);

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

        if (!this.intervalId) {
            return
        }

        clearInterval(this.intervalId);
        this.intervalId = null;
    }
}