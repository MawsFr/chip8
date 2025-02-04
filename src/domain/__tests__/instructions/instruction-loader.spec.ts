import { InstructionLoader } from "../../instructions/instruction-loader.ts";
import { useTestInstructionConfig } from "../helpers/test-configs.ts";

describe(InstructionLoader, () => {
    describe(InstructionLoader.loadInstructions, () => {
        const config = useTestInstructionConfig()

        // When
        const result = InstructionLoader.loadInstructions(config);

        it('should load all instructions', () => {
            // Then
            expect(result).toHaveLength(35)
        });

        it('should load 0000 instruction last', () => {
            // Then
            expect(result).toHaveLength(35)
        })
    });
});