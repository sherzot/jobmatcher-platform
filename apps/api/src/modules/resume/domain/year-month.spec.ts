import { isYearMonth } from './year-month';

describe('resume year-month value', () => {
  it.each(['2026年07月', '2000年01月'])('accepts %s', (value) => {
    expect(isYearMonth(value)).toBe(true);
  });

  it.each(['2026-07', '2026年7月', 'July 2026', ''])('rejects %s', (value) => {
    expect(isYearMonth(value)).toBe(false);
  });
});
