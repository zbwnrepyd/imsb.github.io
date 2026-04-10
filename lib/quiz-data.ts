import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const LEGACY_DATA_CUTOFF = "const DRUNK_TRIGGER_QUESTION_ID = 'drink_gate_q2';";
const DIMENSION_ORDER = [
  'S1',
  'S2',
  'S3',
  'E1',
  'E2',
  'E3',
  'A1',
  'A2',
  'A3',
  'Ac1',
  'Ac2',
  'Ac3',
  'So1',
  'So2',
  'So3',
] as const;

export type DimensionKey = (typeof DIMENSION_ORDER)[number];
export type Level = 'L' | 'M' | 'H';

type DimensionMetaEntry = {
  name: string;
  model: string;
};

type QuestionOption = {
  label: string;
  value: number;
};

export type QuizQuestion = {
  id: string;
  dim: DimensionKey;
  text: string;
  options: QuestionOption[];
};

export type SpecialQuestion = {
  id: string;
  special: true;
  kind: string;
  text: string;
  options: QuestionOption[];
};

type TypeLibraryEntry = {
  code: string;
  cn: string;
  intro: string;
  desc: string;
};

export type NormalType = {
  code: string;
  pattern: string;
};

type LegacyQuizData = {
  dimensionMeta: Record<DimensionKey, DimensionMetaEntry>;
  questions: QuizQuestion[];
  specialQuestions: SpecialQuestion[];
  TYPE_LIBRARY: Record<string, TypeLibraryEntry>;
  TYPE_IMAGES: Record<string, string>;
  NORMAL_TYPES: NormalType[];
  DIM_EXPLANATIONS: Record<DimensionKey, Record<Level, string>>;
  dimensionOrder: string[];
};

function loadLegacyQuizData(): LegacyQuizData {
  const legacyScriptPath = fileURLToPath(new URL('../public/main.js', import.meta.url));
  const legacyScript = readFileSync(legacyScriptPath, 'utf8');
  const dataCutoff = legacyScript.indexOf(LEGACY_DATA_CUTOFF);

  if (dataCutoff === -1) {
    throw new Error('Unable to locate quiz data block in public/main.js');
  }

  const sandbox: Record<string, unknown> = {};
  const dataSource = `${legacyScript.slice(0, dataCutoff)}
globalThis.__quizData = {
  dimensionMeta,
  questions,
  specialQuestions,
  TYPE_LIBRARY,
  TYPE_IMAGES,
  NORMAL_TYPES,
  DIM_EXPLANATIONS,
  dimensionOrder
};`;

  vm.createContext(sandbox);
  vm.runInContext(dataSource, sandbox, { filename: legacyScriptPath });

  return sandbox.__quizData as LegacyQuizData;
}

const legacyQuizData = loadLegacyQuizData();

if (legacyQuizData.dimensionOrder.join(',') !== DIMENSION_ORDER.join(',')) {
  throw new Error('Legacy dimension order does not match extracted dimension order');
}

export const dimensionMeta = legacyQuizData.dimensionMeta;
export const questions = legacyQuizData.questions;
export const specialQuestions = legacyQuizData.specialQuestions;
export const TYPE_LIBRARY = legacyQuizData.TYPE_LIBRARY;
export const TYPE_IMAGES = legacyQuizData.TYPE_IMAGES;
export const NORMAL_TYPES = legacyQuizData.NORMAL_TYPES;
export const DIM_EXPLANATIONS = legacyQuizData.DIM_EXPLANATIONS;
export const dimensionOrder = DIMENSION_ORDER;
export const DRUNK_TRIGGER_QUESTION_ID = 'drink_gate_q2' as const;
