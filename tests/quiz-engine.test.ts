import { describe, expect, it } from 'vitest';

import {
  NORMAL_TYPES,
  TYPE_LIBRARY,
  dimensionMeta,
  dimensionOrder,
  questions,
  specialQuestions,
} from '../lib/quiz-data';
import { computeResult } from '../lib/quiz-engine';

function buildUniformAnswers(value: number) {
  return Object.fromEntries(questions.map((question) => [question.id, value]));
}

function buildAnswersFromLevels(levels: readonly ('L' | 'M' | 'H')[]) {
  const answerByLevel = {
    L: [1, 1],
    M: [2, 2],
    H: [3, 3],
  } as const;

  return Object.fromEntries(
    levels.flatMap((level, index) => {
      const [first, second] = answerByLevel[level];

      return [
        [`q${index * 2 + 1}`, first],
        [`q${index * 2 + 2}`, second],
      ];
    }),
  );
}

describe('computeResult regression', () => {
  it('keeps extracted quiz data internally consistent', () => {
    expect(dimensionOrder).toHaveLength(15);
    expect(Object.keys(dimensionMeta)).toEqual([...dimensionOrder]);
    expect(specialQuestions.map((question) => question.id)).toEqual([
      'drink_gate_q1',
      'drink_gate_q2',
    ]);

    for (const question of questions) {
      expect(dimensionOrder).toContain(question.dim);
    }

    for (const type of NORMAL_TYPES) {
      expect(type.pattern.replace(/-/g, '')).toHaveLength(dimensionOrder.length);
      expect(TYPE_LIBRARY[type.code]).toBeDefined();
    }
  });

  it('returns DRUNK when the hidden drink trigger is selected', () => {
    const answers = {
      ...buildUniformAnswers(3),
      drink_gate_q1: 3,
      drink_gate_q2: 2,
    };

    const result = computeResult(answers);

    expect(result.finalType.code).toBe('DRUNK');
    expect(result.bestNormal.code).toBe('CTRL');
    expect(result.secondaryType?.code).toBe('CTRL');
    expect(result.special).toBe(true);
    expect(result.badge).toBe('匹配度 100% · 酒精异常因子已接管');
  });

  it('keeps the legacy CTRL result stable on a non-hidden all-high answer set', () => {
    const answers = {
      ...buildUniformAnswers(3),
      drink_gate_q1: 1,
    };

    const result = computeResult(answers);

    expect(result.finalType.code).toBe('CTRL');
    expect(result.bestNormal.code).toBe('CTRL');
    expect(result.special).toBe(false);
    expect(result.bestNormal.similarity).toBe(87);
    expect(result.bestNormal.exact).toBe(11);
    expect(Object.values(result.levels)).toEqual(new Array(15).fill('H'));
  });

  it('falls back to HHHH on the legacy low-similarity answer profile', () => {
    const answers = buildAnswersFromLevels([
      'L',
      'L',
      'L',
      'L',
      'L',
      'L',
      'M',
      'L',
      'L',
      'H',
      'H',
      'H',
      'H',
      'M',
      'L',
    ]);

    const result = computeResult(answers);

    expect(result.bestNormal.code).toBe('FUCK');
    expect(result.bestNormal.similarity).toBe(57);
    expect(result.finalType.code).toBe('HHHH');
    expect(result.special).toBe(true);
    expect(result.badge).toBe('标准人格库最高匹配仅 57%');
  });

  it('throws a clear error when regular quiz answers are incomplete', () => {
    expect(() => computeResult({ q1: 1 })).toThrowError(
      'Incomplete quiz answers: missing regular question answers for q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30',
    );
  });
});
