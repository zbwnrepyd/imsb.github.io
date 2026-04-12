import { afterEach, describe, expect, it, vi } from 'vitest';

import { questions } from '../lib/quiz-data';
import { computeResult } from '../lib/quiz-engine';
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

function buildUniformAnswers(value: number) {
  return Object.fromEntries(questions.map((question) => [question.id, value]));
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

    const result = computeResult(buildUniformAnswers(3));
    const latest = {
      version: STORAGE_VERSION,
      typeCode: result.finalType.code,
      payload: result,
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

    expect(localStorage.getItem(QUIZ_PROGRESS_KEY)).not.toBeNull();
    expect(readQuizProgress()).toBeNull();
    expect(localStorage.getItem(QUIZ_PROGRESS_KEY)).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith(QUIZ_PROGRESS_KEY);
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

    const result = computeResult(buildUniformAnswers(3));
    localStorage.setItem(
      LATEST_RESULT_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        typeCode: result.finalType.code,
        payload: {
          ...result,
          finalType: {
            code: result.finalType.code,
            cn: result.finalType.cn,
            intro: result.finalType.intro,
          },
        },
        createdAt: '2026-04-10T00:00:00.000Z',
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
