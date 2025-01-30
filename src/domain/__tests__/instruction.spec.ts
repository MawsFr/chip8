import { Instruction } from "../instruction.ts";
import { describe } from "vitest";

class Mock$00E0 extends Instruction {
    constructor() {
        super(0x00E0, 0xFFFF)
    }

    execute(): void {
        throw new Error("Method not implemented.");
    }
}

describe('Instruction', () => {
    describe('matches()', () => {
        it("should return true if the instruction matches the fetched opcode", () => {
            const fetchedOpcode = 0x00E0
            const instruction = new Mock$00E0()

            const result = instruction.matches(fetchedOpcode)

            expect(result).toBeTruthy()
        });

        it("should return false if the instruction does not match the fetched opcode", () => {
            const fetchedOpcode = 0x00A0
            const instruction: Instruction = new Mock$00E0()

            const result = instruction.matches(fetchedOpcode)

            expect(result).toBeFalsy()
        });
    });
});