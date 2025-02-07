import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            enabled: false,
            reporter: 'html',
            provider: 'v8',
            exclude: [ 'dist/**', '*.config.*', '*.d.ts' ],
        },
        isolate: false,
        setupFiles: [ '../test.setup.js' ],
    },
})