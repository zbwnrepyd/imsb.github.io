import {
  DRUNK_TRIGGER_QUESTION_ID,
  NORMAL_TYPES,
  TYPE_LIBRARY,
  dimensionMeta,
  dimensionOrder,
  questions,
  specialQuestions,
  type DimensionKey,
  type Level,
  type QuizQuestionId,
  type SpecialQuestion,
  type TypeCode,
  type QuizQuestion,
} from './quiz-data';

export type QuizAnswers = Record<string, number | undefined>;
export type QuizQuestionOrder = string[];
export type VisibleQuizQuestion = QuizQuestion | SpecialQuestion;

type TypeProfile = {
  code: string;
  cn: string;
  intro: string;
  desc: string;
};

export type RankedType = TypeProfile & {
  pattern: string;
  distance: number;
  exact: number;
  similarity: number;
};

export type QuizResult = {
  rawScores: Record<DimensionKey, number>;
  levels: Record<DimensionKey, Level>;
  ranked: RankedType[];
  bestNormal: RankedType;
  finalType: TypeProfile | RankedType;
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
  secondaryType: RankedType | null;
};

const DRINK_GATE_QUESTION_ID = specialQuestions[0].id;
const baseQuestionIds = [...questions.map((question) => question.id), DRINK_GATE_QUESTION_ID];
const questionLookup = new Map<string, VisibleQuizQuestion>(
  [...questions, ...specialQuestions].map((question) => [question.id, question]),
);
const baseQuestionIdSet = new Set<string>(baseQuestionIds);

function shuffleIds(
  ids: readonly QuizQuestionId[],
  random: () => number,
): QuizQuestionId[] {
  const next = [...ids];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function hasAnswer(
  answers: QuizAnswers,
  questionId: string,
): boolean {
  return answers[questionId] !== undefined;
}

function isValidAnswerValue(questionId: string, value: number): boolean {
  const question = questionLookup.get(questionId);
  return question ? question.options.some((option) => option.value === value) : false;
}

export function createQuestionOrder(random: () => number = Math.random): QuizQuestionOrder {
  const shuffledRegularIds = shuffleIds(
    questions.map((question) => question.id),
    random,
  );
  const insertIndex = Math.floor(random() * shuffledRegularIds.length) + 1;

  return [
    ...shuffledRegularIds.slice(0, insertIndex),
    DRINK_GATE_QUESTION_ID,
    ...shuffledRegularIds.slice(insertIndex),
  ];
}

export function isQuestionOrderValid(questionOrder: readonly string[]): boolean {
  if (questionOrder.length !== baseQuestionIds.length) {
    return false;
  }

  const seen = new Set<string>();

  for (const questionId of questionOrder) {
    if (!baseQuestionIdSet.has(questionId) || seen.has(questionId)) {
      return false;
    }

    seen.add(questionId);
  }

  return seen.size === baseQuestionIds.length;
}

export function normalizeQuizAnswers(answers: QuizAnswers): Record<string, number> {
  const normalizedAnswers: Record<string, number> = {};

  for (const [questionId, value] of Object.entries(answers)) {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      continue;
    }

    if (!isValidAnswerValue(questionId, value)) {
      continue;
    }

    normalizedAnswers[questionId] = value;
  }

  if (normalizedAnswers[DRINK_GATE_QUESTION_ID] !== 3) {
    delete normalizedAnswers[DRUNK_TRIGGER_QUESTION_ID];
  }

  return normalizedAnswers;
}

export function applyAnswer(
  answers: QuizAnswers,
  questionId: string,
  value: number,
): Record<string, number> {
  return normalizeQuizAnswers({
    ...answers,
    [questionId]: value,
  });
}

export function getVisibleQuestionIds(
  questionOrder: readonly string[],
  answers: QuizAnswers,
): string[] {
  const visibleQuestionIds = [...questionOrder];
  const gateIndex = visibleQuestionIds.indexOf(DRINK_GATE_QUESTION_ID);

  if (gateIndex !== -1 && answers[DRINK_GATE_QUESTION_ID] === 3) {
    visibleQuestionIds.splice(gateIndex + 1, 0, DRUNK_TRIGGER_QUESTION_ID);
  }

  return visibleQuestionIds;
}

export function getVisibleQuestions(
  questionOrder: readonly string[],
  answers: QuizAnswers,
): VisibleQuizQuestion[] {
  return getVisibleQuestionIds(questionOrder, answers)
    .map((questionId) => questionLookup.get(questionId))
    .filter((question): question is VisibleQuizQuestion => question !== undefined);
}

export function getQuizProgress(
  questionOrder: readonly string[],
  answers: QuizAnswers,
): {
  answered: number;
  total: number;
  complete: boolean;
} {
  const visibleQuestionIds = getVisibleQuestionIds(questionOrder, answers);
  const answered = visibleQuestionIds.filter((questionId) => hasAnswer(answers, questionId)).length;
  const total = visibleQuestionIds.length;

  return {
    answered,
    total,
    complete: total > 0 && answered === total,
  };
}

export function sumToLevel(score: number): Level {
  if (score <= 3) {
    return 'L';
  }

  if (score === 4) {
    return 'M';
  }

  return 'H';
}

export function levelNum(level: Level): number {
  return {
    L: 1,
    M: 2,
    H: 3,
  }[level];
}

export function parsePattern(pattern: string): Level[] {
  return pattern.replace(/-/g, '').split('') as Level[];
}

export function getDrunkTriggered(answers: QuizAnswers): boolean {
  return answers[DRUNK_TRIGGER_QUESTION_ID] === 2;
}

function getMissingRegularQuestionIds(answers: QuizAnswers): QuizQuestionId[] {
  return questions
    .filter((question) => answers[question.id] === undefined)
    .map((question) => question.id);
}

export function computeResult(answers: QuizAnswers): QuizResult {
  const missingRegularQuestionIds = getMissingRegularQuestionIds(answers);

  if (missingRegularQuestionIds.length > 0) {
    throw new Error(
      `Incomplete quiz answers: missing regular question answers for ${missingRegularQuestionIds.join(', ')}`,
    );
  }

  const rawScores = Object.fromEntries(
    (Object.keys(dimensionMeta) as DimensionKey[]).map((dimension) => [dimension, 0]),
  ) as Record<DimensionKey, number>;

  for (const question of questions) {
    rawScores[question.dim] += Number(answers[question.id]);
  }

  const levels = Object.fromEntries(
    (Object.entries(rawScores) as [DimensionKey, number][]).map(([dimension, score]) => [
      dimension,
      sumToLevel(score),
    ]),
  ) as Record<DimensionKey, Level>;

  const userVector = dimensionOrder.map((dimension) => levelNum(levels[dimension]));
  const ranked = NORMAL_TYPES.map((type) => {
    const vector = parsePattern(type.pattern).map(levelNum);
    let distance = 0;
    let exact = 0;

    for (let index = 0; index < vector.length; index += 1) {
      const diff = Math.abs(userVector[index] - vector[index]);
      distance += diff;

      if (diff === 0) {
        exact += 1;
      }
    }

    return {
      ...type,
      ...TYPE_LIBRARY[type.code as TypeCode],
      distance,
      exact,
      similarity: Math.max(0, Math.round((1 - distance / 30) * 100)),
    };
  }).sort((left, right) => {
    if (left.distance !== right.distance) {
      return left.distance - right.distance;
    }

    if (right.exact !== left.exact) {
      return right.exact - left.exact;
    }

    return right.similarity - left.similarity;
  });

  const bestNormal = ranked[0];
  const drunkTriggered = getDrunkTriggered(answers);

  let finalType: TypeProfile | RankedType;
  let modeKicker = '你的主类型';
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
  let special = false;
  let secondaryType: RankedType | null = null;

  if (drunkTriggered) {
    finalType = TYPE_LIBRARY.DRUNK;
    secondaryType = bestNormal;
    modeKicker = '隐藏人格已激活';
    badge = '匹配度 100% · 酒精异常因子已接管';
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.HHHH;
    modeKicker = '系统强制兜底';
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
    special = true;
  } else {
    finalType = bestNormal;
  }

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType,
  };
}
