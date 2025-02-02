import { Cpu } from "../domain/cpu.ts";
import { Graphics } from "../domain/graphics.ts";
import Stack from "../domain/stack.ts";
import Registers from "../domain/registers.ts";
import Memory from "../domain/memory.ts";
import { Input } from "../domain/input.ts";
import { Timer } from "../domain/timers.ts";
import { Emulator } from "../domain/emulator.ts";
import { ref } from "vue";

export const useEmulator = () => {
    const graphics = new Graphics();
    const stack = new Stack();
    const registers = new Registers();
    const memory = new Memory(registers);
    const input = new Input();
    const delayTimer = new Timer();
    const soundTimer = new Timer();

    const cpu = new Cpu({
        graphics,
        stack,
        registers,
        memory,
        input,
        delayTimer,
        soundTimer,
    });

    const emulator = ref(new Emulator({
        cpu,
        graphics,
        stack,
        registers,
        memory,
        input,
        delayTimer,
        soundTimer
    }))

    return {
        emulator
    };
}