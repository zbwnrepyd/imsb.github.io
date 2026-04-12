import { describe, expect, it } from 'vitest';

import { getTypeImageSrc } from '../lib/result-media';

describe('getTypeImageSrc', () => {
  it('returns a base64 image for a known IMSB result type', () => {
    expect(getTypeImageSrc('IMSB')).toMatch(/^data:image\//);
  });

  it('returns null when a result type has no mapped image', () => {
    expect(getTypeImageSrc('UNKNOWN')).toBeNull();
  });
});
