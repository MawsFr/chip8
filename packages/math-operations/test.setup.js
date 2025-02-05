import {afterEach, vi} from "vitest";


afterEach(() => {
    console.log('Cleaning test environment');
    vi.restoreAllMocks();
    vi.useRealTimers()
    vi.resetAllMocks();
    vi.clearAllTimers();
    vi.clearAllMocks();
})