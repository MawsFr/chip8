import { Graphics } from "../../graphics.ts";
import Stack from "../../stack.ts";
import Registers from "../../registers.ts";
import Memory from "../../memory.ts";
import { Input } from "../../input.ts";
import { Timer } from "../../timers.ts";
import { Cpu } from "../../cpu.ts";
import type { InstructionContext } from "../../instruction.ts";

export const useTestContext = (): InstructionContext => {
    const graphics = new Graphics()
    const stack = new Stack()
    const registers = new Registers()
    const memory = new Memory(registers)
    const input = new Input()
    const delayTimer = new Timer()
    const soundTimer = new Timer()
    const cpu = new Cpu(graphics, stack, registers, memory, input, delayTimer, soundTimer)

    return { graphics, stack, registers, memory, input, delayTimer, soundTimer, cpu }
}