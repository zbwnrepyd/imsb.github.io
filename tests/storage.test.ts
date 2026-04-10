import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  LATEST_RESULT_KEY,
  QUIZ_PROGRESS_KEY,
  STORAGE_VERSION,
  canUseStorage,
  clearLatestResult,
  clearQuizProgress,
  readLatestResult,
  readQuizProgress,
  saveLatestResult,
  saveQuizProgress,
} from '../lib/storage';

function createStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('storage helpers', () => {
  it('returns null and clears corrupted quiz progress data', () => {
    const localStorage = {
      getItem: vi.fn(() => '{broken'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('window', { localStorage });

    expect(readQuizProgress()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith(QUIZ_PROGRESS_KEY);
  });

  it('round-trips quiz progress through localStorage', () => {
    const localStorage = createStorageMock();
    vi.stubGlobal('window', { localStorage });

    const progress = {
      version: STORAGE_VERSION,
      questionOrder: ['q1', 'q2'],
      answers: {
        q1: 1,
        q2: 3,
      },
      updatedAt: '2026-04-10T00:00:00.000Z',
    };

    saveQuizProgress(progress);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      QUIZ_PROGRESS_KEY,
      JSON.stringify(progress),
    );
    expect(readQuizProgress()).toEqual(progress);
  });

  it('round-trips latest result through localStorage', () => {
    const localStorage = createStorageMock();
    vi.stubGlobal('window', { localStorage });

    const latest = {
      version: STORAGE_VERSION,
      typeCode: 'CTRL',
      payload: {
        badge: '匹配度 87%',
      },
      createdAt: '2026-04-10T00:00:00.000Z',
    };

    saveLatestResult(latest);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      LATEST_RESULT_KEY,
      JSON.stringify(latest),
    );
    expect(readLatestResult()).toEqual(latest);
  });

  it('returns null for mismatched stored versions', () => {
    const localStorage = createStorageMock();
    vi.stubGlobal('window', { localStorage });

    localStorage.setItem(
      QUIZ_PROGRESS_KEY,
      JSON.stringify({
        version: STORAGE_VERSION + 1,
        questionOrder: [],
        answers: {},
        updatedAt: '2026-04-10T00:00:00.000Z',
      }),
    );

    expect(readQuizProgress()).toBeNull();
  });

  it('returns null for structurally corrupted quiz progress data with a matching version', () => {
    const localStorage = createStorageMock();
    vi.stubGlobal('window', { localStorage });

    localStorage.setItem(
      QUIZ_PROGRESS_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
      }),
    );

    expect(readQuizProgress()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith(QUIZ_PROGRESS_KEY);
  });

  it('returns null for structurally corrupted latest result data with a matching version', () => {
    const localStorage = createStorageMock();
    vi.stubGlobal('window', { localStorage });

    localStorage.setItem(
      LATEST_RESULT_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        typeCode: 'CTRL',
        payload: null,
      }),
    );

    expect(readLatestResult()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith(LATEST_RESULT_KEY);
  });

  it('exposes browser availability safely in a non-browser environment', () => {
    expect(canUseStorage()).toBe(false);
  });

  it('clears stored quiz progress and latest result entries', () => {
    const localStorage = createStorageMock();
    vi.stubGlobal('window', { localStorage });

    clearQuizProgress();
    clearLatestResult();

    expect(localStorage.removeItem).toHaveBeenNthCalledWith(1, QUIZ_PROGRESS_KEY);
    expect(localStorage.removeItem).toHaveBeenNthCalledWith(2, LATEST_RESULT_KEY);
  });
});
