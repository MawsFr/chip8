import { Cpu } from "./cpu.ts";
import { Graphics } from "./graphics.ts";
import Stack from "./stack.ts";
import { afterEach, expect } from "vitest";
import Registers from "./registers.ts";
import Memory from "./memory.ts";
import { Input } from "./input.ts";
import { Timer } from "./timers.ts";

describe('OpcodesInterpreter', () => {
    let cpu: Cpu;
    let graphics: Graphics;
    let stack: Stack;
    let registers: Registers;
    let memory: Memory;
    let input: Input
    let delayTimer: Timer
    let soundTimer: Timer

    beforeEach(() => {
        graphics = new Graphics()
        stack = new Stack()
        registers = new Registers()
        memory = new Memory(registers)
        input = new Input()
        delayTimer = new Timer()
        soundTimer = new Timer()
        cpu = new Cpu(graphics, stack, registers, memory, input, delayTimer, soundTimer)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('getProgramCounter()', () => {
        it('should return program counter current value', () => {
            cpu.setProgramCounter(0x400)

            expect(cpu.getProgramCounter()).equals(0x400)
        });
    });

    describe('setProgramCounter()', () => {
        it('should set program counter to new address', () => {
            cpu.setProgramCounter(0x200)

            expect(cpu).property('programCounter').to.equal(0x200)
        });
    });

    describe('incrementProgramCounter()', () => {
        it('should increment program counter', () => {
            cpu.setProgramCounter(0x200)

            cpu.incrementProgramCounter()

            expect(cpu.getProgramCounter()).to.equal(0x201)
        });
    });

    describe('interpret()', () => {
        it('"00E0" should clean screen', () => {
            vi.spyOn(graphics, 'clearScreen').mockImplementation(() => {
            });

            cpu.interpret(0x00E0)

            expect(graphics.clearScreen).toHaveBeenCalledOnce()
        });

        it('"00EE" should return from a subroutine', () => {
            // should pop last value of the stack to PC ?
            // Given
            stack.push(0x200)
            cpu.setProgramCounter(0x400)

            // When
            cpu.interpret(0x00EE)

            // Then
            expect(cpu.getProgramCounter()).equals(0x200)
        });

        it('"0NNN" should skipped', () => {
            const oldInterpreter: Cpu = structuredClone(cpu)

            cpu.interpret(0x0111)

            expect(cpu).to.deep.equal(oldInterpreter)
        });

        it('"1NNN" should go to address NNN', () => {
            cpu.interpret(0x1201)

            expect(cpu.getProgramCounter()).to.equal(0x201)
        });

        it('"2NNN" should execute subroutine at NNN', () => {
            cpu.setProgramCounter(0x400)
            cpu.interpret(0x2200)

            expect(stack.pop()).to.equal(0x400)
            expect(cpu.getProgramCounter()).to.equal(0x200)
        });

        it('"3XNN" should ignore next instruction if VX equals NN', () => {
            registers.setV(0, 0x20)
            cpu.setProgramCounter(0x400)

            cpu.interpret(0x3020)

            expect(cpu.getProgramCounter()).to.equal(0x402)
        });

        it('"4XNN" should ignore next instruction if VX is different from NN', () => {
            registers.setV(0, 0x40)
            cpu.setProgramCounter(0x400)

            cpu.interpret(0x4020)

            expect(cpu.getProgramCounter()).to.equal(0x402)
        });

        it('"5XY0" should ignore next instruction if VX equals VY', () => {
            registers.setV(0, 0x40)
            registers.setV(1, 0x40)
            cpu.setProgramCounter(0x400)

            cpu.interpret(0x5010)

            expect(cpu.getProgramCounter()).to.equal(0x402)
        });

        it('"6XNN" should set VX to NN', () => {
            cpu.interpret(0x6020)

            expect(registers.getV(0)).to.equal(0x20)
        });

        it('"7XNN" should add NN to VX', () => {
            registers.setV(0, 0x20)

            cpu.interpret(0x7010)

            expect(registers.getV(0)).to.equal(0x30)
        });

        it('"8XY0" should set VX to VY value', () => {
            registers.setV(0, 0x20)
            registers.setV(1, 0x40)

            cpu.interpret(0x8010)

            expect(registers.getV(0)).to.equal(0x40)
        });

        it('"8XY1" should set VX to VX OR VY', () => {
            registers.setV(0, 0x20)
            registers.setV(1, 0x40)

            cpu.interpret(0x8011)

            expect(registers.getV(0)).to.equal(0x60)
        });

        it('"8XY2" should set VX to VX AND VY', () => {
            registers.setV(0, 0x20)
            registers.setV(1, 0x40)

            cpu.interpret(0x8012)

            expect(registers.getV(0)).to.equal(0x0)
        });

        it('"8XY3" should set VX to VX XOR VY', () => {
            registers.setV(0, 0x20)
            registers.setV(1, 0x40)

            cpu.interpret(0x8013)

            expect(registers.getV(0)).to.equal(0x60)
        });

        it('"8XY4" should add VY to VX. VF is set to 1 if overflow', () => {
            registers.setV(0, 0xFF)
            registers.setV(1, 0xFF)

            cpu.interpret(0x8014)

            expect(registers.getV(0)).to.equal(0xFE)
            expect(registers.getV(0xF)).to.equal(1)
        });

        it('"8XY4" should add VY to VX. VF is set to 0 if no overflow', () => {
            registers.setV(0, 0x20)
            registers.setV(1, 0x30)
            registers.setV(0xF, 1)

            cpu.interpret(0x8014)

            expect(registers.getV(0)).to.equal(0x50)
            expect(registers.getV(0xF)).to.equal(0)
        });

        it('"8XY5" should subtract VY from VX. VF is set to 1 if VX >= VY', () => {
            registers.setV(0, 0x30)
            registers.setV(1, 0x20)

            cpu.interpret(0x8015)

            expect(registers.getV(0)).to.equal(0x10)
            expect(registers.getV(0xF)).to.equal(1)
        });

        it('"8XY5" should subtract VY from VX. VF is set to 0 if VX < VY', () => {
            registers.setV(0, 0x10)
            registers.setV(1, 0x20)

            cpu.interpret(0x8015)

            expect(registers.getV(0)).to.equal(0xF0)
            expect(registers.getV(0xF)).to.equal(0)
        });

        it('"8XY6" should shift VX to the right. VF is set to the least significant bit of VX prior to the shift into VF.', () => {
            registers.setV(0, 0x23)

            cpu.interpret(0x8016)

            expect(registers.getV(0)).to.equal(0x11)
            expect(registers.getV(0xF)).to.equal(0x1)
        });

        it('"8XY7" should set VX to VY minus VX. VF is set to 1 if VY >= VX', () => {
            registers.setV(0, 0x20)
            registers.setV(1, 0x30)

            cpu.interpret(0x8017)

            expect(registers.getV(0)).to.equal(0x10)
            expect(registers.getV(0xF)).to.equal(1)
        });

        it('"8XY7" should set VX to VY minus VX. VF is set to 0 if VY < VX', () => {
            registers.setV(0, 0x30)
            registers.setV(1, 0x20)

            cpu.interpret(0x8017)

            expect(registers.getV(0)).to.equal(0xF0)
            expect(registers.getV(0xF)).to.equal(0)
        });

        it('"8XYE" should shift VX to the left. VF is set to the most significant bit of VX prior to the shift into VF.', () => {
            registers.setV(0, 0x88)

            cpu.interpret(0x801E)

            expect(registers.getV(0)).to.equal(0x10)
            expect(registers.getV(0xF)).to.equal(0x1)
        });

        it('"9XY0" should skip the next instruction if VX is different of VY', () => {
            registers.setV(0, 0x40)
            registers.setV(1, 0x41)
            cpu.setProgramCounter(0x400)

            cpu.interpret(0x9010)

            expect(cpu.getProgramCounter()).to.equal(0x402)
        });

        it('"ANNN" should set I to NNN', () => {
            cpu.interpret(0xA200)

            expect(registers.getI()).to.equal(0x200)
        });

        it('"BNNN" should jump to the address NNN + V0', () => {
            registers.setV(0, 0x20)

            cpu.interpret(0xB200)

            expect(cpu.getProgramCounter()).to.equal(0x220)
        });

        it('"CXNN" should set VX to a random number & NN', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.1)

            cpu.interpret(0xC010)

            expect(registers.getV(0)).to.equal(0x10)
        });

        it('"DXYN" should draw a non overlapping sprite of width of 8, height of N at (VX, VY)', () => {
            /*
                11000000
                11000000
             */
            const sprite = [
                0xC0,
                0xC0,
            ]

            registers.setV(0, 1)
            registers.setV(1, 1)

            registers.setI(0x200)

            memory.load(sprite)

            cpu.interpret(0xD012)

            expect(graphics.getPixelAt(65)).equals(true)
            expect(graphics.getPixelAt(66)).equals(true)
            expect(graphics.getPixelAt(129)).equals(true)
            expect(graphics.getPixelAt(130)).equals(true)

            expect(registers.getV(0xF)).to.equal(0)
        });

        it('"DXYN" should draw an overlapping sprite of width of 8, height of N at (VX, VY)', () => {
            /*
                11000000
                11000000
             */
            const sprite = [
                0xC0,
                0xC0,
            ]

            graphics.switchOn(65)

            registers.setV(0, 1)
            registers.setV(1, 1)

            registers.setI(0x200)

            memory.load(sprite)

            cpu.interpret(0xD002)

            expect(graphics.getPixelAt(65)).equals(true)
            expect(graphics.getPixelAt(66)).equals(true)
            expect(graphics.getPixelAt(129)).equals(true)
            expect(graphics.getPixelAt(130)).equals(true)
            expect(registers.getV(0xF)).to.equal(1)
        });

        it('"EX9E" should skip the next instruction if the key in VX is pressed', () => {
            registers.setV(0, 0x8)
            cpu.setProgramCounter(0x200)
            input.press(0x8)

            cpu.interpret(0xE09E)

            expect(cpu.getProgramCounter()).to.equal(0x202)
        });

        it('"EXA1" should skip the next instruction if the key in VX is not pressed', () => {
            registers.setV(0, 0x8)
            cpu.setProgramCounter(0x200)
            input.release(0x8)

            cpu.interpret(0xE0A1)

            expect(cpu.getProgramCounter()).to.equal(0x202)
        });
        it('"FX07" should set VX to the value of the delay timer', () => {
            delayTimer.write(0x30)

            cpu.interpret(0xF007)

            expect(registers.getV(0)).to.equal(0x30)
        });

        it('"FX0A" should await for a key press', () => {
            // TODO
            // FIXME
        });

        it('"FX15" should set the delay timer to VX', () => {
            registers.setV(0, 0x30)

            cpu.interpret(0xF015)

            expect(delayTimer.read()).to.equal(0x30)
        });

        it('"FX18" should set the sound timer to VX', () => {
            registers.setV(0, 0x30)

            cpu.interpret(0xF018)

            expect(soundTimer.read()).to.equal(0x30)
        });

        it('"FX1E" should add VX to I', () => {
            registers.setV(0, 0x20)
            registers.setI(0x20)

            cpu.interpret(0xF01E)

            expect(registers.getI()).to.equal(0x40)
        });

        it('"FX29" should set I to the address of the character stored in VX', () => {
            registers.setV(0, 0x5)

            cpu.interpret(0xF029)

            expect(registers.getI()).to.equal(0x19)
        });

        it('"FX33" should store the BCD representation of VX in memory at location', () => {
            registers.setV(0, 123);
            registers.setI(0x300);

            cpu.interpret(0xF033);

            expect(memory.getDataAt(0x300)).to.equal(1);
            expect(memory.getDataAt(0x301)).to.equal(2);
            expect(memory.getDataAt(0x302)).to.equal(3);
        });

        it('"FX55" should store from V0 to VX (included) into memory starting at I', () => {
            registers.setV(0x0, 0x12);
            registers.setV(0x1, 0x34);
            registers.setV(0x2, 0x56);
            registers.setV(0x3, 0x78);
            registers.setI(0x300);

            cpu.interpret(0xF355);

            expect(memory.getDataAt(0x300)).to.equal(0x12);
            expect(memory.getDataAt(0x301)).to.equal(0x34);
            expect(memory.getDataAt(0x302)).to.equal(0x56);
            expect(memory.getDataAt(0x303)).to.equal(0x78);
        });

        it('"FX65" should fill from V0 to VX (included) from memory starting at I', () => {
            registers.setI(0x300)
            memory.load([ 0x12, 0x34, 0x56, 0x78 ])

            cpu.interpret(0xF365)

            expect(registers.getV(0x0)).to.equal(0x12)
            expect(registers.getV(0x1)).to.equal(0x34)
            expect(registers.getV(0x2)).to.equal(0x56)
            expect(registers.getV(0x3)).to.equal(0x78)
        });
    });
});