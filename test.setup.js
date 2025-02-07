import {afterAll, beforeEach, vi} from "vitest";

beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
    vi.resetAllMocks();
    vi.clearAllMocks();
    vi.useFakeTimers();
})

afterAll(() => {
    vi.useRealTimers();
})