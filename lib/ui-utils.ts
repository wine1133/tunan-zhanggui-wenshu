export const ROLE_LABELS: Record<string, string> = {
  primary_key: "主键",
  foreign_key: "外键",
  measure: "度量",
  dimension: "维度",
  fact: "事实表",
  dim: "维度表",
};

export function formatMoney(value: number, compact = false) {
  if (compact) {
    if (Math.abs(value) >= 100000000) return `¥${(value / 100000000).toFixed(2)}亿`;
    if (Math.abs(value) >= 10000) return `¥${(value / 10000).toFixed(1)}万`;
  }
  return `¥${value.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
}

export function formatNumber(value: number) {
  return value.toLocaleString("zh-CN", { maximumFractionDigits: 0 });
}

export function formatClock(value: string) {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function metricValue(value: unknown, unit: "元" | "件" | "单") {
  const number = Number(value ?? 0);
  if (unit === "元") return formatMoney(number, number >= 10000);
  return `${formatNumber(number)} ${unit}`;
}