import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { questions } from '../lib/quiz-data';
import { computeResult } from '../lib/quiz-engine';

function buildUniformAnswers(value: number) {
  return Object.fromEntries(questions.map((question) => [question.id, value]));
}

describe('computeResult regression', () => {
  it('keeps quiz data as static TS exports without node runtime extraction', () => {
    const quizDataSource = readFileSync(resolve(__dirname, '../lib/quiz-data.ts'), 'utf8');

    expect(quizDataSource).not.toContain('node:fs');
    expect(quizDataSource).not.toContain('node:vm');
    expect(quizDataSource).not.toContain('readFileSync');
    expect(quizDataSource).not.toContain('runInContext');
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
});
