"use client";

import { BarChart3, LineChart as LineChartIcon } from "lucide-react";
import type { QueryPayload } from "../lib/api-types";
import { metricValue } from "../lib/ui-utils";

export function ResultVisualization({ result }: { result: QueryPayload }) {
  if (result.chart.type === "none") {
    return (
      <div className="rounded-2xl border border-[#e4e8ef] bg-gradient-to-br from-[#fff8f4] to-white p-5">
        <p className="text-[11px] font-medium text-[#98a2b3]">{result.metricLabel}</p>
        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#172033]">{metricValue(result.rows[0]?.[result.chart.metricKey], result.chart.unit)}</p>
      </div>
    );
  }
  if (result.chart.type === "line") return <ResultLineChart result={result} />;
  return <ResultBarChart result={result} />;
}

function ResultBarChart({ result }: { result: QueryPayload }) {
  const dimensionKey = result.chart.dimensionKey;
  const rows = result.rows.slice(0, 12);
  const max = Math.max(...rows.map((row) => Number(row[result.chart.metricKey] ?? 0)), 1);
  return (
    <div className="rounded-2xl border border-[#e4e8ef] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#667085]"><BarChart3 size={14} />{result.dimensionLabel}对比</span>
        <span className="text-[10px] text-[#98a2b3]">展示前 {rows.length} 项</span>
      </div>
      <div className="space-y-3">
        {rows.map((row, index) => {
          const label =
            result.dimensionLabel === "地区 / 商品"
              ? `${String(row["地区"] ?? "—")} · ${String(row["商品"] ?? "—")}`
              : dimensionKey
                ? String(row[dimensionKey] ?? "—")
                : `第 ${index + 1} 项`;
          const value = Number(row[result.chart.metricKey] ?? 0);
          return (
            <div key={`${label}-${index}`} className="grid grid-cols-[minmax(80px,150px)_minmax(80px,1fr)_auto] items-center gap-3">
              <span className="truncate text-[11px] font-medium text-[#596273]" title={label}>{label}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#f0f2f5]">
                <div className={`h-full rounded-full ${index === 0 ? "bg-[#ff6b2c]" : "bg-[#ffb18e]"}`} style={{ width: `${Math.max(3, (value / max) * 100)}%` }} />
              </div>
              <span className="min-w-[62px] text-right text-[11px] font-semibold text-[#344054]">{metricValue(value, result.chart.unit)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultLineChart({ result }: { result: QueryPayload }) {
  const dimensionKey = result.chart.dimensionKey;
  const rows = result.rows.slice(0, 24);
  const width = 720;
  const height = 190;
  const max = Math.max(...rows.map((row) => Number(row[result.chart.metricKey] ?? 0)), 1);
  const points = rows.map((row, index) => ({
    x: 12 + (index / Math.max(1, rows.length - 1)) * (width - 24),
    y: 14 + (height - 40) - (Number(row[result.chart.metricKey] ?? 0) / max) * (height - 40),
    label: dimensionKey ? String(row[dimensionKey] ?? "") : `${index + 1}`,
    value: Number(row[result.chart.metricKey] ?? 0),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `M ${points[0]?.x ?? 0} ${height - 26} L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points.at(-1)?.x ?? 0} ${height - 26} Z`;
  return (
    <div className="rounded-2xl border border-[#e4e8ef] bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#667085]"><LineChartIcon size={14} />{result.dimensionLabel}趋势</span>
        <span className="text-[10px] text-[#98a2b3]">共 {rows.length} 个节点</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[190px] w-full" role="img" aria-label={`${result.dimensionLabel}趋势图`}>
        <defs>
          <linearGradient id="result-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#246bfd" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#246bfd" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((index) => {
          const y = 14 + (index / 3) * (height - 40);
          return <line key={index} x1="12" x2={width - 12} y1={y} y2={y} stroke="#e8ebf0" strokeDasharray="4 5" />;
        })}
        <path d={area} fill="url(#result-area)" />
        <polyline points={line} fill="none" stroke="#246bfd" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle cx={point.x} cy={point.y} r="3.5" fill="#fff" stroke="#246bfd" strokeWidth="2" />
            {rows.length <= 8 || index % 3 === 0 || index === rows.length - 1 ? (
              <text x={point.x} y={height - 6} textAnchor={index === 0 ? "start" : index === rows.length - 1 ? "end" : "middle"} fontSize="9.5" fill="#8c95a4">{point.label}</text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function ResultTable({ result }: { result: QueryPayload }) {
  const previewRows = result.rows.slice(0, 10);
  if (!result.columns.length) return <div className="px-4 py-8 text-center text-sm text-[#98a2b3]">没有匹配的数据</div>;
  return (
    <div className="max-h-[360px] overflow-auto scrollbar-thin">
      <table className="min-w-full border-collapse text-left text-[11px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-white">
            {result.columns.map((column) => <th key={column} className="whitespace-nowrap border-b border-[#edf0f4] px-4 py-2.5 font-semibold text-[#667085]">{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {previewRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-[#fafbfc]" : "bg-white"}>
              {result.columns.map((column) => (
                <td key={column} className="whitespace-nowrap border-b border-[#f0f2f5] px-4 py-2.5 text-[#344054] last:border-b-0">
                  {typeof row[column] === "number" ? Number(row[column]).toLocaleString("zh-CN", { maximumFractionDigits: 2 }) : String(row[column] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result.rows.length > previewRows.length ? <div className="border-t border-[#edf0f4] bg-[#fafbfc] px-4 py-2 text-[10px] text-[#98a2b3]">仅预览前 {previewRows.length} 行，共 {result.rowCount} 行</div> : null}
    </div>
  );
}