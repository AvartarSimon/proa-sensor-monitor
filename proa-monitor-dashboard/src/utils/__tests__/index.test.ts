import { formatNumber, formattedTime } from '../index';

describe('Utils', () => {
  describe('formatNumber', () => {
    it('should format numbers with default decimal places', () => {
      expect(formatNumber(123.456)).toBe('123.46');
      expect(formatNumber(123.4)).toBe('123.40');
      expect(formatNumber(123)).toBe('123.00');
    });

    it('should format numbers with custom decimal places', () => {
      expect(formatNumber(123.456, 1)).toBe('123.5');
      expect(formatNumber(123.456, 3)).toBe('123.456');
      expect(formatNumber(123.456, 0)).toBe('123');
    });

    it('should handle auto-pad zero option', () => {
      expect(formatNumber(123.4, 2, true)).toBe('123.40');
      expect(formatNumber(123.4, 2, false)).toBe('123.4');
    });

    it('should handle string inputs', () => {
      expect(formatNumber('123.456')).toBe('123.46');
      expect(formatNumber('123')).toBe('123.00');
    });

    it('should handle invalid inputs', () => {
      expect(formatNumber('invalid')).toBe('-');
      expect(formatNumber(NaN)).toBe('-');
      expect(formatNumber('')).toBe('-');
    });

    it('should handle zero values', () => {
      expect(formatNumber(0)).toBe('0.00');
      expect(formatNumber(0, 1)).toBe('0.0');
      expect(formatNumber(0, 0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-123.456)).toBe('-123.46');
      expect(formatNumber(-123.4, 1)).toBe('-123.4');
    });

    it('should handle large numbers', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
      expect(formatNumber(1000000)).toBe('1,000,000.00');
    });
  });

  describe('formattedTime', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2024-01-15T14:30:45Z');
      const formatted = formattedTime(testDate);

      // Should match Australian format: DD/MM/YYYY, HH:MM:SS
      expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/);
    });

    it('should handle different dates', () => {
      const date1 = new Date('2024-12-31T23:59:59Z');
      const date2 = new Date('2024-01-01T00:00:00Z');

      const formatted1 = formattedTime(date1);
      const formatted2 = formattedTime(date2);

      expect(formatted1).not.toBe(formatted2);
      expect(formatted1).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/);
      expect(formatted2).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/);
    });

    it('should use 24-hour format', () => {
      const morningDate = new Date('2024-01-15T09:30:45Z');
      const eveningDate = new Date('2024-01-15T21:30:45Z');

      const morningFormatted = formattedTime(morningDate);
      const eveningFormatted = formattedTime(eveningDate);

      // Should not contain AM/PM
      expect(morningFormatted).not.toMatch(/AM|PM/i);
      expect(eveningFormatted).not.toMatch(/AM|PM/i);

      // Should contain the correct hours
      expect(morningFormatted).toContain('09:30:45');
      expect(eveningFormatted).toContain('21:30:45');
    });

    it('should handle edge cases', () => {
      const startOfYear = new Date('2024-01-01T00:00:00Z');
      const endOfYear = new Date('2024-12-31T23:59:59Z');

      const startFormatted = formattedTime(startOfYear);
      const endFormatted = formattedTime(endOfYear);

      expect(startFormatted).toMatch(/01\/01\/2024, 00:00:00/);
      expect(endFormatted).toMatch(/31\/12\/2024, 23:59:59/);
    });

    it('should handle leap year dates', () => {
      const leapYearDate = new Date('2024-02-29T12:00:00Z');
      const formatted = formattedTime(leapYearDate);

      expect(formatted).toMatch(/29\/02\/2024, 12:00:00/);
    });

    it('should handle single digit values', () => {
      const singleDigitDate = new Date('2024-01-05T05:05:05Z');
      const formatted = formattedTime(singleDigitDate);

      expect(formatted).toMatch(/05\/01\/2024, 05:05:05/);
    });
  });
});
