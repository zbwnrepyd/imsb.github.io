import {
  DRUNK_TRIGGER_QUESTION_ID,
  NORMAL_TYPES,
  TYPE_LIBRARY,
  dimensionMeta,
  dimensionOrder,
  questions,
  type DimensionKey,
  type Level,
  type QuizQuestionId,
  type TypeCode,
} from './quiz-data';

export type QuizAnswers = Record<string, number | undefined>;

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
