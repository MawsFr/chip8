import { Cpu, CpuConfig, Graphics, Input, InstructionConfig, Memory, Registers, Stack, Timer } from "../../src";

export const useTestInstructionConfig = (): InstructionConfig => {
    const graphics = new Graphics()
    const stack = new Stack()
    const registers = new Registers()
    const memory = new Memory(registers)
    const input = new Input()
    const delayTimer = new Timer()
    const soundTimer = new Timer()
    const cpu = new Cpu({ graphics, stack, registers, memory, input, delayTimer, soundTimer })

    return { graphics, stack, registers, memory, input, delayTimer, soundTimer, cpu }
}

export const useTestCpuConfig = (): CpuConfig => {
    const graphics = new Graphics()
    const stack = new Stack()
    const registers = new Registers()
    const memory = new Memory(registers)
    const input = new Input()
    const delayTimer = new Timer()
    const soundTimer = new Timer()

    return { graphics, stack, registers, memory, input, delayTimer, soundTimer }
}