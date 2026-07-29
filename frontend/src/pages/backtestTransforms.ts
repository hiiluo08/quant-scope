import type { DailyBacktestRow } from "../api/types";

export type DrawdownRow = Pick<DailyBacktestRow, "date" | "equity_curve"> & {
  drawdown: number;
};

export function rollingMax(values: number[]): number[] {
  let maximum = Number.NEGATIVE_INFINITY;
  return values.map((value) => {
    maximum = Math.max(maximum, value);
    return maximum;
  });
}

export function toDrawdown(rows: DailyBacktestRow[]): DrawdownRow[] {
  const maxima = rollingMax(rows.map((row) => row.equity_curve));
  return rows.map((row, index) => ({
    date: row.date,
    equity_curve: row.equity_curve,
    drawdown: maxima[index] === 0 ? 0 : row.equity_curve / maxima[index] - 1,
  }));
}
