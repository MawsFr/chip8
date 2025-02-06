import { useChip8Emulator } from "../src";
import { describe, expect, it } from "vitest";

describe(useChip8Emulator, () => {
    it('should be defined successfully', () => {
        const { emulator } = useChip8Emulator()

        expect(emulator.value).toBeDefined()
    });
})