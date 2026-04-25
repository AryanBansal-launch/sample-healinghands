/** Parse `YYYY-MM-DD` to UTC midnight range for Mongo `preferredDate` queries. */
export function utcDayRangeFromYyyyMmDd(dateParam: string): { start: Date; end: Date } | null {
  const s = dateParam.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return {
    start: new Date(Date.UTC(y, m - 1, d)),
    end: new Date(Date.UTC(y, m - 1, d + 1)),
  };
}

export function preferredDateToYyyyMmDd(v: unknown): string | null {
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  return null;
}
