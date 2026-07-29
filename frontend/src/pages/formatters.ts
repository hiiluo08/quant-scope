export const formatNumber = (value: number | null | undefined, digits = 2) =>
  value === null || value === undefined || !Number.isFinite(value)
    ? "Not available"
    : value.toFixed(digits);

export const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value))
    return "Not available";
  return `${(value * 100).toFixed(2)}%`;
};
