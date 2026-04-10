export const STORAGE_VERSION = 1;
export const QUIZ_PROGRESS_KEY = 'imsb.quiz.progress';
export const LATEST_RESULT_KEY = 'imsb.result.latest';

export type QuizProgress = {
  version: number;
  questionOrder: string[];
  answers: Record<string, number>;
  updatedAt: string;
};

export type LatestResult = {
  version: number;
  typeCode: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

type StoredVersionedValue = {
  version: number;
};

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return typeof window.localStorage === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readStoredValue<T extends StoredVersionedValue>(key: string): T | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  let raw: string | null = null;
  try {
    raw = storage.getItem(key);
  } catch {
    return null;
  }

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('version' in parsed) ||
      (parsed as StoredVersionedValue).version !== STORAGE_VERSION
    ) {
      removeStoredValue(key);
      return null;
    }

    return parsed as T;
  } catch {
    try {
      storage.removeItem(key);
    } catch {
      // Ignore cleanup failures.
    }

    return null;
  }
}

function writeStoredValue(key: string, value: unknown): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore persistence failures so callers can continue safely.
  }
}

function removeStoredValue(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Ignore cleanup failures.
  }
}

function clearStoredValue(key: string): void {
  removeStoredValue(key);
}

export function canUseStorage(): boolean {
  return getStorage() !== null;
}

export function saveQuizProgress(progress: QuizProgress): void {
  writeStoredValue(QUIZ_PROGRESS_KEY, progress);
}

export function readQuizProgress(): QuizProgress | null {
  return readStoredValue<QuizProgress>(QUIZ_PROGRESS_KEY);
}

export function clearQuizProgress(): void {
  clearStoredValue(QUIZ_PROGRESS_KEY);
}

export function saveLatestResult(result: LatestResult): void {
  writeStoredValue(LATEST_RESULT_KEY, result);
}

export function readLatestResult(): LatestResult | null {
  return readStoredValue<LatestResult>(LATEST_RESULT_KEY);
}

export function clearLatestResult(): void {
  clearStoredValue(LATEST_RESULT_KEY);
}
