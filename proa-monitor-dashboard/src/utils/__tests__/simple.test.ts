import { formatNumber } from '../index';

describe('Simple Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });

  it('should format numbers correctly', () => {
    expect(formatNumber(123.456)).toBe('123.46');
  });
});
