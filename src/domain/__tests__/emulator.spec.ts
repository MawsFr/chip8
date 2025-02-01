import { Emulator, State } from "../emulator.ts";
import { afterEach, beforeEach, expect, vi } from "vitest";
import { Cpu } from "../cpu.ts";
import { Graphics } from "../graphics.ts";
import Stack from "../stack.ts";
import Registers from "../registers.ts";
import Memory from "../memory.ts";
import { Input } from "../input.ts";
import { Timer } from "../timers.ts";
import { Opcode } from "../opcode.ts";

describe('Emulator', () => {
    let cpu: Cpu;
    let graphics: Graphics;
    let stack: Stack;
    let registers: Registers;
    let memory: Memory;
    let input: Input
    let delayTimer: Timer
    let soundTimer: Timer
    let emulator: Emulator

    beforeEach(() => {
        graphics = new Graphics()
        stack = new Stack()
        registers = new Registers()
        memory = new Memory(registers)
        input = new Input()
        delayTimer = new Timer()
        soundTimer = new Timer()
        cpu = new Cpu(graphics, stack, registers, memory, input, delayTimer, soundTimer)
        emulator = new Emulator(cpu, graphics, stack, registers, memory, input, delayTimer, soundTimer)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('loadROM()', () => {
        it('should load a rom in memory', () => {
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]); // Exemple d'instructions
            emulator.loadROM(romData);

            expect(memory.getDataAt(0x200)).to.equal(0x00);
            expect(memory.getDataAt(0x201)).to.equal(0xE0);
            expect(memory.getDataAt(0x202)).to.equal(0xA2);
            expect(memory.getDataAt(0x203)).to.equal(0xF0);

        });
    });

    describe('run()', () => {
        it('should run manually the emulator', () => {
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]); // Exemple d'instructions
            emulator.loadROM(romData);

            emulator.run(true)

            expect(emulator.state).to.equal('RUNNING')
        });

        it('should run automatically the emulator', async () => {
            vi.spyOn(emulator, 'executeNextInstruction')
            vi.useFakeTimers()
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]); // Exemple d'instructions
            emulator.loadROM(romData);

            emulator.run(false)
            vi.advanceTimersByTime(1000 / 60)

            expect(emulator.state).to.equal('RUNNING')
            expect(emulator.intervalId).to.not.equal(null)
            expect(emulator.executeNextInstruction).toHaveBeenCalledTimes(4)
        });

        it('should clear interval when emulator is stopped', async () => {
            vi.spyOn(globalThis, 'clearInterval')
            vi.useFakeTimers()
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]); // Exemple d'instructions
            emulator.loadROM(romData);

            emulator.run(false)
            vi.advanceTimersByTime(1000 / 60)
            emulator.state = State.OFF
            vi.advanceTimersByTime(1000 / 60)

            expect(globalThis.clearInterval).toHaveBeenCalledTimes(1)
        })
    });

    describe('executeNextInstruction()', () => {
        it('should execute next instruction', () => {
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]); // Exemple d'instructions
            emulator.loadROM(romData);

            vi.spyOn(emulator, 'updateTimers')
            vi.spyOn(cpu, 'interpret')
            vi.spyOn(emulator, 'readNextOpcode')

            emulator.executeNextInstruction()

            expect(emulator.readNextOpcode).toHaveBeenCalledTimes(1)
            expect(cpu.interpret).toHaveBeenCalledTimes(1)
            expect(cpu.interpret).toHaveBeenCalledWith(new Opcode(0x00E0))
            expect(emulator.updateTimers).toHaveBeenCalledTimes(1)
            expect(emulator.lastOpcode).to.deep.equal(new Opcode(0x00E0))
        });
    });

    describe('readNextOpcode()', () => {
        it('should read next opcode', () => {
            const romData = new Uint8Array([ 0x10, 0xE0, 0xA2, 0xF0 ]); // Exemple d'instructions
            emulator.loadROM(romData);

            const opcode = emulator.readNextOpcode()

            expect(opcode.value).to.equal(0x10E0)
        });
    });

    describe('updateTimers()', () => {
        it('should update delay and sound timer', () => {
            delayTimer.write(1)
            soundTimer.write(1)

            emulator.updateTimers()
            emulator.updateTimers()

            expect(delayTimer.read()).to.equal(0)
            expect(soundTimer.read()).to.equal(0)

        });
    });

    describe('reset()', () => {
        it('should reset the emulator', () => {
            vi.spyOn(memory, 'reset')
            vi.spyOn(graphics, 'clearScreen')
            vi.spyOn(stack, 'reset')
            vi.spyOn(registers, 'reset')
            vi.spyOn(cpu, 'reset')
            vi.spyOn(input, 'reset')
            vi.spyOn(delayTimer, 'reset')
            vi.spyOn(soundTimer, 'reset')
            vi.spyOn(globalThis, 'clearInterval')

            emulator.run()
            emulator.reset()

            expect(memory.getDataAt(0x200)).to.equal(0)
            expect(graphics.clearScreen).toHaveBeenCalledTimes(1)
            expect(stack.reset).toHaveBeenCalledTimes(1)
            expect(registers.reset).toHaveBeenCalledTimes(1)
            expect(cpu.reset).toHaveBeenCalledTimes(1)
            expect(input.reset).toHaveBeenCalledTimes(1)
            expect(delayTimer.reset).toHaveBeenCalledTimes(1)
            expect(soundTimer.reset).toHaveBeenCalledTimes(1)
            expect(emulator.state).to.equal('OFF')
            expect(emulator.lastOpcode).to.equal(null)
            expect(globalThis.clearInterval).toHaveBeenCalledTimes(1)
            expect(emulator.intervalId).to.equal(null)
        });

    });
});