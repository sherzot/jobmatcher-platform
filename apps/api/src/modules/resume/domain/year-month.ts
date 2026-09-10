export const YEAR_MONTH_PATTERN = /^\d{4}年\d{2}月$/;

export function isYearMonth(value: string): boolean {
  return YEAR_MONTH_PATTERN.test(value);
}
