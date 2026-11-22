"use client";

import {
  Loader2,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import type { OverviewData } from "../lib/api-types";
import type { QueryEntry } from "./app-types";
import QueryCard from "./query-result";
import {
  CategoryCard,
  OverviewCards,
  RecentActivity,
  RegionRankingCard,
  TrendCard,
} from "./dashboard-overview";

const EXAMPLES = [
  "2025年各地区销售总额",
  "2025年各个商品的销量",
  "各地区销量排名前三的商品",
  "按月份看2025年销售趋势",
  "各会员等级的客单价",
  "各品牌销售额排名",
];

export default function WorkbenchView({
  overview,
  entries,
  question,
  setQuestion,
  isRunning,
  onSubmit,
  onExample,
  bottomRef,
  onOpenHistory,
}: {
  overview: OverviewData | null;
  entries: QueryEntry[];
  question: string;
  setQuestion: (value: string) => void;
  isRunning: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onExample: (question: string) => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  onOpenHistory: () => void;
}) {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] bg-[#111a2b] px-5 py-6 text-white shadow-[0_22px_60px_rgba(17,26,43,.16)] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#ff6b2c]/35 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#246bfd]/20 blur-[90px]" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(310px,.65fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-white/65">
              <Sparkles size={13} className="text-[#ff9a6b]" />
              统一元数据 · 安全 SQL · 自动可视化
            </div>
            <h1 className="mt-5 max-w-[720px] text-[clamp(30px,4.4vw,50px)] font-semibold leading-[1.08] tracking-[-0.035em]">
              问一句，
              <span className="text-[#ff8a54]">把数据变成答案。</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-[15px]">
              用中文直接询问销售、商品、地区和客户表现。掌柜问数会自动理解问题、召回指标口径、生成并执行 SQL。
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-white/60">Agent 执行链路</span>
              <span className="rounded-full bg-[#c9f27b]/10 px-2 py-1 text-[10px] font-semibold text-[#d7ff9c]">READY</span>
            </div>
            <div className="space-y-2">
              {[
                ["01", "元数据召回", "表 · 字段 · 指标"],
                ["02", "SQL 生成", "上下文增强"],
                ["03", "安全校验", "只读白名单"],
                ["04", "执行与洞察", "表格 · 图表"],
              ].map(([number, title, detail], index) => (
                <div key={number} className="flex items-center gap-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${index === 0 ? "bg-[#c9f27b] text-[#111a2b]" : "border border-white/10 bg-white/5 text-white/50"}`}>{number}</span>
                  <div className="min-w-0 flex-1 rounded-lg border border-white/[0.07] bg-black/10 px-3 py-2">
                    <p className="text-xs font-medium text-white/80">{title}</p>
                    <p className="mt-0.5 text-[10px] text-white/35">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-1 rounded-2xl border border-[#e0e4eb] bg-white p-3 shadow-[0_16px_42px_rgba(17,26,43,.08)] sm:p-4">
        <form onSubmit={onSubmit} className="flex items-end gap-3">
          <span className="mb-1 hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fff0e8] text-[#ef6428] sm:grid">
            <Search size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <label htmlFor="query" className="mb-1.5 block text-xs font-medium text-[#667085]">自然语言问数</label>
            <textarea
              id="query"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={2}
              placeholder="例如：2025年各地区销售总额，哪个地区贡献最多？"
              className="min-h-[50px] w-full resize-none border-0 bg-transparent p-0 text-base font-medium leading-6 text-[#182230] outline-none placeholder:text-[#a5adba]"
            />
          </div>
          <button
            type="submit"
            disabled={!question.trim() || isRunning}
            className="mb-0.5 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ff6b2c] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,107,44,.28)] transition hover:bg-[#e95d20] disabled:cursor-not-allowed disabled:bg-[#d9dde5] disabled:text-[#929bab] disabled:shadow-none"
          >
            {isRunning ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            <span className="hidden sm:inline">{isRunning ? "分析中" : "开始问数"}</span>
          </button>
        </form>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {EXAMPLES.map((example) => (
            <button
              type="button"
              key={example}
              onClick={() => onExample(example)}
              disabled={isRunning}
              className="shrink-0 rounded-full border border-[#e1e5ec] bg-[#f8f9fb] px-3 py-1.5 text-[11px] font-medium text-[#596273] transition hover:border-[#ffb18e] hover:bg-[#fff6f1] hover:text-[#d95218] disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      <OverviewCards overview={overview} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,.75fr)]">
        <TrendCard overview={overview} />
        <RegionRankingCard overview={overview} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(310px,.65fr)_minmax(0,1.35fr)]">
        <CategoryCard overview={overview} />
        <RecentActivity overview={overview} onOpenHistory={onOpenHistory} onRerun={onExample} />
      </div>

      {entries.length > 0 ? (
        <section className="space-y-4 pt-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#98a1b0]">Live Analysis</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">本次分析</h2>
            </div>
            <span className="text-xs text-[#8a93a2]">{entries.length} 个问题</span>
          </div>
          {entries.map((entry) => <QueryCard key={entry.id} entry={entry} />)}
          <div ref={bottomRef} />
        </section>
      ) : null}
    </div>
  );
}