"use client";

import {
  Bot,
  Check,
  Code2,
  Copy,
  Gauge,
  Loader2,
  Network,
  Sparkles,
  Table2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { QueryEntry } from "./app-types";
import { ResultTable, ResultVisualization } from "./result-charts";

export default function QueryCard({ entry }: { entry: QueryEntry }) {
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = entry.result;

  async function copySql() {
    if (!result) return;
    await navigator.clipboard.writeText(result.sql);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#dfe4ec] bg-white shadow-[0_14px_38px_rgba(17,26,43,.06)]">
      <div className="border-b border-[#edf0f4] px-4 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#172033] text-[11px] font-bold text-white">你</span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#98a2b3]">你的问题</p>
            <p className="mt-0.5 text-[15px] font-semibold leading-6 text-[#1d2939]">{entry.question}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ff6b2c] text-white shadow-[0_8px_20px_rgba(255,107,44,.22)]"><Bot size={19} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#344054]">掌柜 AI</p>
                <p className="mt-0.5 text-[10px] text-[#98a2b3]">
                  {entry.status === "running" ? "正在分析数据" : entry.status === "success" ? "分析完成" : "执行失败"}
                </p>
              </div>
              {result ? (
                <div className="flex items-center gap-2 text-[10px] text-[#98a2b3]">
                  <span className="rounded-full bg-[#f4f6f9] px-2 py-1">{result.rowCount} 行</span>
                  <span className="rounded-full bg-[#f4f6f9] px-2 py-1">{result.elapsedMs}ms</span>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-xl border border-[#edf0f4] bg-[#fafbfc] p-3" aria-live="polite">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {entry.stages.map((stage, index) => (
                  <span key={`${stage.label}-${index}`} className="inline-flex items-center gap-1.5 text-[11px] text-[#667085]">
                    {stage.status === "running" ? <Loader2 size={13} className="animate-spin text-[#ff6b2c]" /> : stage.status === "error" ? <X size={13} className="text-red-500" /> : <Check size={13} className="text-emerald-600" />}
                    {stage.label}
                  </span>
                ))}
                {entry.stages.length === 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#667085]"><Loader2 size={13} className="animate-spin text-[#ff6b2c]" />连接数据仓库</span>
                ) : null}
              </div>
            </div>

            {entry.error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{entry.error}</div> : null}

            {result ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-2xl bg-[#111a2b] px-4 py-4 text-white">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#c9f27b] text-[#111a2b]"><Zap size={15} /></span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">自动洞察</p>
                      <p className="mt-1 text-sm leading-6 text-white/85">{result.insight}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#7b8494]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f6f9] px-2.5 py-1.5"><Network size={12} />召回 {result.recall.tables.map((table) => table.name).join(" + ")}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f6f9] px-2.5 py-1.5"><Gauge size={12} />{result.recall.metric?.name ?? result.metricLabel}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f6f9] px-2.5 py-1.5"><Table2 size={12} />{result.dimensionLabel} × {result.metricLabel}</span>
                </div>

                {result.rows.length > 0 ? <ResultVisualization result={result} /> : null}

                <div className="overflow-hidden rounded-xl border border-[#e4e8ef]">
                  <div className="flex items-center justify-between border-b border-[#edf0f4] bg-[#fafbfc] px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#667085]"><Table2 size={14} />查询结果</span>
                    <button type="button" onClick={() => setShowSql((current) => !current)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-medium text-[#667085] transition hover:bg-white hover:text-[#344054]"><Code2 size={13} />{showSql ? "收起 SQL" : "查看 SQL"}</button>
                  </div>
                  <ResultTable result={result} />
                </div>

                {showSql ? (
                  <div className="overflow-hidden rounded-xl border border-[#243044] bg-[#101827]">
                    <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/55"><Code2 size={13} />Generated SQL</span>
                      <button type="button" onClick={copySql} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1 text-[10px] text-white/60 transition hover:bg-white/5 hover:text-white">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "已复制" : "复制"}</button>
                    </div>
                    <pre className="max-h-[320px] overflow-auto p-4 text-[11px] leading-6 text-[#c6d0e1] scrollbar-thin"><code>{result.sql}</code></pre>
                  </div>
                ) : null}
              </div>
            ) : entry.status === "running" ? (
              <div className="mt-5 space-y-3">
                <div className="h-14 animate-pulse rounded-xl bg-[#f2f4f7]" />
                <div className="h-40 animate-pulse rounded-xl bg-[#f2f4f7]" />
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#98a2b3]"><Sparkles size={14} />可以换一种问法再试一次。</div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}