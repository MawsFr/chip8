import { Emulator } from "./emulator.ts";
import { beforeEach, expect } from "vitest";
import { Cpu } from "./cpu.ts";
import { Graphics } from "./graphics.ts";
import Stack from "./stack.ts";
import Registers from "./registers.ts";
import Memory from "./memory.ts";
import { Input } from "./input.ts";
import { Timer } from "./timers.ts";

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

    describe('readNextOpcode()', () => {
        it('should read next opcode', () => {
            const romData = new Uint8Array([ 0x10, 0xE0, 0xA2, 0xF0 ]); // Exemple d'instructions
            emulator.loadROM(romData);

            const opcode = emulator.readNextOpcode()

            expect(opcode).to.equal(0x10E0)
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
});