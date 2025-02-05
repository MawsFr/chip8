import { InstructionLoader } from "../../src/instructions";
import { useTestInstructionConfig } from "../helpers/test-configs";
import { describe, expect, it } from "vitest";

describe(InstructionLoader, () => {
    describe(InstructionLoader.loadInstructions, () => {
        const config = useTestInstructionConfig()

        // When
        const result = InstructionLoader.loadInstructions(config);

        it('should load all instructions', () => {
            // Then
            expect(result).toHaveLength(35)
        });

        it('should load 0NNN instruction last', () => {
            // Then
            expect(result).toHaveLength(35)
        })
    });
});