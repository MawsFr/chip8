import { beforeEach, describe, expect, it, vi } from "vitest";
import * as instructions from "../src/instructions";
import { InstructionConfig, InstructionLoader } from "../src/instructions";
import { Cpu, CpuConfig, Opcode } from "../src";
import { useTestCpuConfig, useTestInstructionConfig } from "./helpers/test-configs";

describe(Cpu, () => {
    let cpu: Cpu
    let cpuConfig: CpuConfig

    beforeEach(() => {
        cpuConfig = useTestCpuConfig()
        cpu = new Cpu(cpuConfig)
    })

    describe(Cpu.prototype.getCurrentAddress, () => {
        it('should return program counter current value', () => {
            cpu.jumpToAddress(0x400)

            expect(cpu.getCurrentAddress()).equals(0x400)
        });
    });

    describe(Cpu.prototype.jumpToAddress, () => {
        it('should set program counter to new address', () => {
            cpu.jumpToAddress(0x200)

            expect(cpu).property('programCounter').to.equal(0x200)
        });
    });

    describe(Cpu.prototype.goToNextInstruction, () => {
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

    describe(Cpu.prototype.callSubroutine, () => {
        it('should call a subroutine', () => {
            cpu.jumpToAddress(0x200)

            cpu.callSubroutine(0x400)

            expect(cpuConfig.stack.pop()).to.equal(0x200)
            expect(cpu.getCurrentAddress()).to.equal(0x400)
        })
    });

    describe(Cpu.prototype.returnFromSubroutine, () => {
        it('should return from a subroutine', () => {
            cpuConfig.stack.push(0x200)
            cpu.jumpToAddress(0x400)

            cpu.returnFromSubroutine()

            expect(cpu.getCurrentAddress()).equals(0x200)
        })
    });

    describe(Cpu.prototype.interpret, () => {
        let instructionConfig: InstructionConfig;

        beforeEach(() => {
            instructionConfig = useTestInstructionConfig()
        })

        it.each([
            [ '0x0000', instructions.$0000 ],
            [ '0x00E0', instructions.$00E0 ],
            [ '0x00EE', instructions.$00EE ],
            [ '0x1000', instructions.$1NNN ],
            [ '0x2000', instructions.$2NNN ],
            [ '0x3000', instructions.$3XNN ],
            [ '0x4000', instructions.$4XNN ],
            [ '0x5000', instructions.$5XY0 ],
            [ '0x6000', instructions.$6XNN ],
            [ '0x7000', instructions.$7XNN ],
            [ '0x8000', instructions.$8XY0 ],
            [ '0x8001', instructions.$8XY1 ],
            [ '0x8002', instructions.$8XY2 ],
            [ '0x8003', instructions.$8XY3 ],
            [ '0x8004', instructions.$8XY4 ],
            [ '0x8005', instructions.$8XY5 ],
            [ '0x8006', instructions.$8XY6 ],
            [ '0x8007', instructions.$8XY7 ],
            [ '0x800E', instructions.$8XYE ],
            [ '0x9000', instructions.$9XY0 ],
            [ '0xA000', instructions.$ANNN ],
            [ '0xB000', instructions.$BNNN ],
            [ '0xC000', instructions.$CXNN ],
            [ '0xD000', instructions.$DXYN ],
            [ '0xE09E', instructions.$EX9E ],
            [ '0xE0A1', instructions.$EXA1 ],
            [ '0xF007', instructions.$FX07 ],
            [ '0xF00A', instructions.$FX0A ],
            [ '0xF015', instructions.$FX15 ],
            [ '0xF018', instructions.$FX18 ],
            [ '0xF01E', instructions.$FX1E ],
            [ '0xF029', instructions.$FX29 ],
            [ '0xF033', instructions.$FX33 ],
            [ '0xF055', instructions.$FX55 ],
            [ '0xF065', instructions.$FX65 ],
        ])("Opcode %s should be interpreted by %s", (opcode, instructionClass) => {
            const instruction = new instructionClass(instructionConfig)
            vi.spyOn(instruction, 'execute').mockReturnValue(void 0)
            vi.spyOn(InstructionLoader, 'loadInstructions').mockReturnValue([ instruction ])
            let cpu = new Cpu(cpuConfig)

            cpu.interpret(new Opcode(parseInt(opcode, 16)))

            expect(instruction.execute).toHaveBeenCalledTimes(1)

        });

        it('should execute nothing if opcode is not recognized', () => {
            cpu.jumpToAddress(0x200)

            cpu.interpret(new Opcode(0xFFFF))

            expect(cpu.getCurrentAddress()).to.equal(0x200)
        })
    });
});