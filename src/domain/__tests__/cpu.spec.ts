import { Cpu } from "../cpu.ts";
import { Graphics } from "../graphics.ts";
import Stack from "../stack.ts";
import { afterEach, beforeEach, expect } from "vitest";
import Registers from "../registers.ts";
import Memory from "../memory.ts";
import { Input } from "../input.ts";
import { Timer } from "../timers.ts";
import { Opcode } from "../opcode.ts";
import { useTestContext } from "./helpers/useTestContext.ts";
import { $00E0 } from "../instructions/$00E0.ts";
import { type InstructionContext } from "../instruction.ts";
import { $00EE } from "../instructions/$00EE.ts";
import { $1NNN } from "../instructions/$1NNN.ts";
import { $2NNN } from "../instructions/$2NNN.ts";
import { $3XNN } from "../instructions/$3XNN.ts";
import { $4XNN } from "../instructions/$4XNN.ts";
import { $5XY0 } from "../instructions/$5XY0.ts";
import { $6XNN } from "../instructions/$6XNN.ts";
import { $7XNN } from "../instructions/$7XNN.ts";
import { $8XY0 } from "../instructions/$8XY0.ts";
import { $8XY1 } from "../instructions/$8XY1.ts";
import { $8XY2 } from "../instructions/$8XY2.ts";
import { $8XY3 } from "../instructions/$8XY3.ts";
import { $8XY4 } from "../instructions/$8XY4.ts";
import { $8XY5 } from "../instructions/$8XY5.ts";
import { $8XY6 } from "../instructions/$8XY6.ts";
import { $8XY7 } from "../instructions/$8XY7.ts";
import { $8XYE } from "../instructions/$8XYE.ts";
import { $9XY0 } from "../instructions/$9XY0.ts";
import { $ANNN } from "../instructions/$ANNN.ts";
import { $BNNN } from "../instructions/$BNNN.ts";
import { $CXNN } from "../instructions/$CXNN.ts";
import { $DXYN } from "../instructions/$DXYN.ts";
import { $EX9E } from "../instructions/$EX9E.ts";
import { $EXA1 } from "../instructions/$EXA1.ts";
import { $FX07 } from "../instructions/$FX07.ts";
import { $FX0A } from "../instructions/$FX0A.ts";
import { $FX15 } from "../instructions/$FX15.ts";
import { $FX18 } from "../instructions/$FX18.ts";
import { $FX1E } from "../instructions/$FX1E.ts";
import { $FX29 } from "../instructions/$FX29.ts";
import { $FX33 } from "../instructions/$FX33.ts";
import { $FX55 } from "../instructions/$FX55.ts";
import { $FX65 } from "../instructions/$FX65.ts";

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

    describe('getCurrentAddress()', () => {
        it('should return program counter current value', () => {
            cpu.jumpToAddress(0x400)

            expect(cpu.getCurrentAddress()).equals(0x400)
        });
    });

    describe('jumpToAddress()', () => {
        it('should set program counter to new address', () => {
            cpu.jumpToAddress(0x200)

            expect(cpu).property('programCounter').to.equal(0x200)
        });
    });

    describe('goToNextInstruction()', () => {
        it('should go to next instruction', () => {
            cpu.jumpToAddress(0x200)

            cpu.goToNextInstruction()

            expect(cpu.getCurrentAddress()).to.equal(0x202)
        });

        describe('skipNextInstruction option', () => {
            it('should skip next instruction if skipIf is true', () => {
                cpu.jumpToAddress(0x200)

                cpu.goToNextInstruction({
                    skipNextInstruction: true
                })

                expect(cpu.getCurrentAddress()).to.equal(0x204)
            })

            it('should not skip next instruction if skipIf is false', () => {
                cpu.jumpToAddress(0x200)

                cpu.goToNextInstruction({
                    skipNextInstruction: false
                })

                expect(cpu.getCurrentAddress()).to.equal(0x202)
            })
        });

    });

    describe('callSubroutine()', () => {
        it('should call a subroutine', () => {
            cpu.jumpToAddress(0x200)

            cpu.callSubroutine(0x400)

            expect(stack.pop()).to.equal(0x200)
            expect(cpu.getCurrentAddress()).to.equal(0x400)
        })
    });

    describe('returnFromSubroutine()', () => {
        it('should return from a subroutine', () => {
            stack.push(0x200)
            cpu.jumpToAddress(0x400)

            cpu.returnFromSubroutine()

            expect(cpu.getCurrentAddress()).equals(0x200)
        })
    });

    describe('interpret()', () => {
        let context: InstructionContext;

        beforeEach(() => {
            context = useTestContext()

            cpu.instructions.forEach((instruction) => {
                vi.spyOn(instruction, 'execute')
            })
        })

        it.each([
            [ 0x00E0, $00E0 ],
            [ 0x00EE, $00EE ],
            [ 0x1000, $1NNN ],
            [ 0x2000, $2NNN ],
            [ 0x3000, $3XNN ],
            [ 0x4000, $4XNN ],
            [ 0x5000, $5XY0 ],
            [ 0x6000, $6XNN ],
            [ 0x7000, $7XNN ],
            [ 0x8000, $8XY0 ],
            [ 0x8001, $8XY1 ],
            [ 0x8002, $8XY2 ],
            [ 0x8003, $8XY3 ],
            [ 0x8004, $8XY4 ],
            [ 0x8005, $8XY5 ],
            [ 0x8006, $8XY6 ],
            [ 0x8007, $8XY7 ],
            [ 0x800E, $8XYE ],
            [ 0x9000, $9XY0 ],
            [ 0xA000, $ANNN ],
            [ 0xB000, $BNNN ],
            [ 0xC000, $CXNN ],
            [ 0xD000, $DXYN ],
            [ 0xE09E, $EX9E ],
            [ 0xE0A1, $EXA1 ],
            [ 0xF007, $FX07 ],
            [ 0xF00A, $FX0A ],
            [ 0xF015, $FX15 ],
            [ 0xF018, $FX18 ],
            [ 0xF01E, $FX1E ],
            [ 0xF029, $FX29 ],
            [ 0xF033, $FX33 ],
            [ 0xF055, $FX55 ],
            [ 0xF065, $FX65 ],
        ])("Opcode 0x%s should be interpreted by %s", (opcode, instructionClass) => {
            const instruction = new instructionClass(context)
            vi.spyOn(instruction, 'execute')

            cpu.instructions = [ instruction ]

            cpu.interpret(new Opcode(opcode))

            expect(instruction.execute).toHaveBeenCalledTimes(1)

        });
    });
});