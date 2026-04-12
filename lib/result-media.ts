import { TYPE_IMAGES, type TypeCode } from './quiz-data';

export function getTypeImageSrc(typeCode: string): string | null {
  return TYPE_IMAGES[typeCode as TypeCode] ?? null;
}
