import type { QuizResult, RankedType } from './quiz-engine';

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
  payload: QuizResult;
  createdAt: string;
};

type StoredVersionedValue = {
  version: number;
};

type Validator<T> = (value: unknown) => value is T;

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => typeof item === 'number')
  );
}

function isLevel(value: unknown): value is 'L' | 'M' | 'H' {
  return value === 'L' || value === 'M' || value === 'H';
}

function isLevelRecord(value: unknown): value is Record<string, 'L' | 'M' | 'H'> {
  return isRecord(value) && Object.values(value).every(isLevel);
}

function isTypeProfileSnapshot(
  value: unknown,
): value is Pick<RankedType, 'code' | 'cn' | 'intro' | 'desc'> {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.cn === 'string' &&
    typeof value.intro === 'string' &&
    typeof value.desc === 'string'
  );
}

function isRankedTypeSnapshot(value: unknown): value is RankedType {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.cn === 'string' &&
    typeof value.intro === 'string' &&
    typeof value.desc === 'string' &&
    typeof value.pattern === 'string' &&
    typeof value.distance === 'number' &&
    typeof value.exact === 'number' &&
    typeof value.similarity === 'number'
  );
}

function isQuizProgress(value: unknown): value is QuizProgress {
  return (
    isRecord(value) &&
    value.version === STORAGE_VERSION &&
    isStringArray(value.questionOrder) &&
    isNumberRecord(value.answers) &&
    typeof value.updatedAt === 'string'
  );
}

function isQuizResult(value: unknown): value is QuizResult {
  return (
    isRecord(value) &&
    isNumberRecord(value.rawScores) &&
    isLevelRecord(value.levels) &&
    Array.isArray(value.ranked) &&
    value.ranked.every(isRankedTypeSnapshot) &&
    isRankedTypeSnapshot(value.bestNormal) &&
    (isTypeProfileSnapshot(value.finalType) || isRankedTypeSnapshot(value.finalType)) &&
    typeof value.modeKicker === 'string' &&
    typeof value.badge === 'string' &&
    typeof value.sub === 'string' &&
    typeof value.special === 'boolean' &&
    (value.secondaryType === null || isRankedTypeSnapshot(value.secondaryType))
  );
}

function isLatestResult(value: unknown): value is LatestResult {
  return (
    isRecord(value) &&
    value.version === STORAGE_VERSION &&
    typeof value.typeCode === 'string' &&
    isQuizResult(value.payload) &&
    value.typeCode === value.payload.finalType.code &&
    typeof value.createdAt === 'string'
  );
}

function readStoredValue<T extends StoredVersionedValue>(
  key: string,
  validator: Validator<T>,
): T | null {
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
    if (!validator(parsed)) {
      removeStoredValue(key);
      return null;
    }

    return parsed;
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
  return readStoredValue<QuizProgress>(QUIZ_PROGRESS_KEY, isQuizProgress);
}

export function clearQuizProgress(): void {
  clearStoredValue(QUIZ_PROGRESS_KEY);
}

export function saveLatestResult(result: LatestResult): void {
  writeStoredValue(LATEST_RESULT_KEY, result);
}

export function readLatestResult(): LatestResult | null {
  return readStoredValue<LatestResult>(LATEST_RESULT_KEY, isLatestResult);
}

export function clearLatestResult(): void {
  clearStoredValue(LATEST_RESULT_KEY);
}
