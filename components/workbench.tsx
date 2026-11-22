"use client";

import {
  Loader2,
  Search,
  Send,
} from "lucide-react";
import type { OverviewData } from "../lib/api-types";
import type { QueryEntry } from "./app-types";
import HeroCarousel from "./hero-carousel";
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
      <HeroCarousel />

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