import { Cpu, Emulator, Graphics, Input, Memory, Registers, Stack, Timer } from "@mawsfr/chip8";
import { ref } from "vue";

export const useChip8Emulator = () => {
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