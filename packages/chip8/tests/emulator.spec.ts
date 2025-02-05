import { Cpu, type CpuConfig, Emulator, Opcode, State } from "../src";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTestCpuConfig } from "./helpers/test-configs";

describe(Emulator, () => {
    let cpu: Cpu
    let cpuConfig: CpuConfig
    let emulator: Emulator

    beforeEach(() => {
        cpuConfig = useTestCpuConfig()
        cpu = new Cpu(cpuConfig)
        emulator = new Emulator({ ...cpuConfig, cpu })
    })

    describe(Emulator.prototype.loadROM, () => {
        it('should load a rom in memory', () => {
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]);
            emulator.loadROM(romData);

            expect(cpuConfig.memory.getDataAt(0x200)).to.equal(0x00);
            expect(cpuConfig.memory.getDataAt(0x201)).to.equal(0xE0);
            expect(cpuConfig.memory.getDataAt(0x202)).to.equal(0xA2);
            expect(cpuConfig.memory.getDataAt(0x203)).to.equal(0xF0);

        });
    });

    describe(Emulator.prototype.run, () => {
        it('should run manually the emulator', () => {
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]);
            emulator.loadROM(romData);

            emulator.run(true)

            expect(emulator.state).to.equal('RUNNING')
        });

        it('should run automatically the emulator', async () => {
            vi.spyOn(emulator, 'executeNextInstruction')
            vi.spyOn(emulator, 'updateTimers')

            vi.useFakeTimers()
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]);
            emulator.loadROM(romData);

            emulator.run(false)
            vi.advanceTimersByTime(1000 / 60)

            expect(emulator.state).to.equal('RUNNING')
            expect(emulator.intervalId).to.not.equal(null)
            expect(emulator.executeNextInstruction).toHaveBeenCalledTimes(10)
            expect(emulator.updateTimers).toHaveBeenCalledTimes(1)
        });

        it('should clear interval when emulator is stopped', async () => {
            vi.useFakeTimers()
            vi.spyOn(globalThis, 'clearInterval')
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]);
            emulator.loadROM(romData);

            emulator.run(false)
            vi.advanceTimersByTime(1000 / 60)
            emulator.state = State.OFF
            vi.advanceTimersByTime(1000 / 60)

            expect(globalThis.clearInterval).toHaveBeenCalledTimes(1)
        })
    });

    describe(Emulator.prototype.executeNextInstruction, () => {
        it('should execute next instruction', () => {
            const romData = new Uint8Array([ 0x00, 0xE0, 0xA2, 0xF0 ]);
            emulator.loadROM(romData);

            vi.spyOn(cpu, 'interpret')
            vi.spyOn(emulator, 'readNextOpcode')

            emulator.executeNextInstruction()

            expect(emulator.readNextOpcode).toHaveBeenCalledTimes(1)
            expect(cpu.interpret).toHaveBeenCalledTimes(1)
            expect(cpu.interpret).toHaveBeenCalledWith(new Opcode(0x00E0))
            expect(emulator.lastOpcode).to.deep.equal(new Opcode(0x00E0))
        });
    });

    describe(Emulator.prototype.readNextOpcode, () => {
        it('should read next opcode', () => {
            const romData = new Uint8Array([ 0x10, 0xE0, 0xA2, 0xF0 ]);
            emulator.loadROM(romData);

            const opcode = emulator.readNextOpcode()

            expect(opcode.value).to.equal(0x10E0)
        });
    });

    describe(Emulator.prototype.updateTimers, () => {
        it('should update delay and sound timer', () => {
            cpuConfig.delayTimer.write(1)
            cpuConfig.soundTimer.write(1)

            emulator.updateTimers()
            emulator.updateTimers()

            expect(cpuConfig.delayTimer.read()).to.equal(0)
            expect(cpuConfig.soundTimer.read()).to.equal(0)

        });
    });

    describe(Emulator.prototype.reset, () => {
        it('should reset the emulator', () => {
            vi.spyOn(cpuConfig.memory, 'reset')
            vi.spyOn(cpuConfig.graphics, 'clearScreen')
            vi.spyOn(cpuConfig.stack, 'reset')
            vi.spyOn(cpuConfig.registers, 'reset')
            vi.spyOn(cpu, 'reset')
            vi.spyOn(cpuConfig.input, 'reset')
            vi.spyOn(cpuConfig.delayTimer, 'reset')
            vi.spyOn(cpuConfig.soundTimer, 'reset')
            vi.spyOn(globalThis, 'clearInterval')

            emulator.run()
            emulator.reset()

            expect(cpu.reset).toHaveBeenCalledTimes(1)
            expect(cpuConfig.memory.getDataAt(0x200)).to.equal(0)
            expect(cpuConfig.graphics.clearScreen).toHaveBeenCalledTimes(1)
            expect(cpuConfig.stack.reset).toHaveBeenCalledTimes(1)
            expect(cpuConfig.registers.reset).toHaveBeenCalledTimes(1)
            expect(cpuConfig.input.reset).toHaveBeenCalledTimes(1)
            expect(cpuConfig.delayTimer.reset).toHaveBeenCalledTimes(1)
            expect(cpuConfig.soundTimer.reset).toHaveBeenCalledTimes(1)
            expect(emulator.state).to.equal('OFF')
            expect(emulator.lastOpcode).to.equal(null)
            expect(emulator.intervalId).to.equal(null)
            expect(globalThis.clearInterval).toHaveBeenCalledTimes(1)
        });

    });
});