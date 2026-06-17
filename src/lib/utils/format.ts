export function formatCurrency(val: number | null): string {
  if (val === null || val === undefined) return "-";
  return val.toLocaleString("ja-JP", { maximumFractionDigits: 0 });
}

export function formatRate(val: number | null): string {
  if (val === null || val === undefined) return "-";
  const pct = val > 1 ? val : val * 100;
  return `${pct.toFixed(1)}%`;
}

export function formatMonth(year: number, month: number): string {
  return `${year}年${month}月`;
}
