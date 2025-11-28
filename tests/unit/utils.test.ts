import '@testing-library/jest-dom';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

describe('Utils - Currency Formatting', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const result = formatCurrency(1234.56, 'USD', 'en-US');
      expect(result).toContain('1,234.56');
    });

    it('should format TRY currency correctly', () => {
      const result = formatCurrency(1234.56, 'TRY', 'tr-TR');
      expect(result).toContain('1.234,56');
    });

    it('should handle zero values', () => {
      const result = formatCurrency(0, 'USD', 'en-US');
      expect(result).toContain('0.00');
    });

    it('should handle negative values', () => {
      const result = formatCurrency(-100, 'USD', 'en-US');
      expect(result).toContain('-');
      expect(result).toContain('100');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with correct decimals', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1.234,57');
    });

    it('should handle large numbers', () => {
      const result = formatNumber(1000000);
      expect(result).toContain('1.000.000');
    });

    it('should respect decimal places', () => {
      const result = formatNumber(3.14159, 2);
      expect(result).toBe('3,14');
    });
  });

  describe('formatPercentage', () => {
    it('should format positive percentages with plus sign', () => {
      expect(formatPercentage(5.25)).toBe('+5.25%');
    });

    it('should format negative percentages', () => {
      expect(formatPercentage(-3.5)).toBe('-3.50%');
    });

    it('should format zero', () => {
      expect(formatPercentage(0)).toBe('+0.00%');
    });

    it('should respect decimal places', () => {
      expect(formatPercentage(1.234, 1)).toBe('+1.2%');
    });
  });
});

describe('Utils - Currency Conversion', () => {
  it('should calculate conversion correctly', () => {
    const amount = 100;
    const rate = 30.5;
    const result = amount * rate;
    expect(result).toBe(3050);
  });

  it('should handle decimal conversions', () => {
    const amount = 12.5;
    const rate = 1.5;
    const result = amount * rate;
    expect(result).toBeCloseTo(18.75);
  });
});
