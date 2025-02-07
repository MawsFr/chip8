import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            reporter: 'html',
            provider: 'v8',
        },
        isolate: false,
        setupFiles: [ '../test.setup.js' ],
    },
})