"use client";

import {
  BarChart3,
  CircleDollarSign,
  Clock3,
  Layers3,
  LineChart as LineChartIcon,
  Play,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { OverviewData } from "../lib/api-types";
import { formatClock, formatMoney, formatNumber } from "../lib/ui-utils";

export function OverviewCards({ overview }: { overview: OverviewData | null }) {
  const cards = [
    { label: "累计销售额", value: overview ? formatMoney(overview.metrics.revenue, true) : "—", note: "2024—2025 年", icon: CircleDollarSign, color: "bg-[#eaf1ff] text-[#246bfd]" },
    { label: "订单总数", value: overview ? formatNumber(overview.metrics.orders) : "—", note: "全部事实记录", icon: ShoppingBag, color: "bg-[#fff0e8] text-[#ef6428]" },
    { label: "成交客户", value: overview ? formatNumber(overview.metrics.customers) : "—", note: "去重客户数", icon: Users, color: "bg-[#e8f8f1] text-[#0b8f62]" },
    { label: "平均客单价", value: overview ? formatMoney(overview.metrics.averageOrder) : "—", note: "单笔订单均值", icon: TrendingUp, color: "bg-[#f1ecff] text-[#6c4ce0]" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-2xl border border-[#e1e5ec] bg-white p-4 shadow-[0_8px_22px_rgba(17,26,43,.035)] sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#7b8494]">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#162033]">{card.value}</p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${card.color}`}><Icon size={19} /></span>
            </div>
            <p className="mt-3 text-[11px] text-[#a0a7b4]">{card.note}</p>
          </div>
        );
      })}
    </section>
  );
}

export function TrendCard({ overview }: { overview: OverviewData | null }) {
  return (
    <section className="rounded-2xl border border-[#e1e5ec] bg-white p-4 shadow-[0_8px_22px_rgba(17,26,43,.035)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef2ff] text-[#4662d9]"><LineChartIcon size={17} /></span>
            <h2 className="text-base font-semibold">2025 年销售趋势</h2>
          </div>
          <p className="mt-2 text-xs text-[#8b94a3]">按月份汇总订单金额，快速识别增长与波动。</p>
        </div>
        <span className="rounded-full bg-[#f4f6f9] px-2.5 py-1 text-[10px] font-medium text-[#657083]">月度</span>
      </div>
      <div className="mt-5">{overview ? <TrendChart data={overview.trend} /> : <ChartSkeleton />}</div>
    </section>
  );
}

function TrendChart({ data }: { data: Array<{ month: string; revenue: number }> }) {
  const width = 760;
  const height = 220;
  const padding = { top: 14, right: 10, bottom: 30, left: 8 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const max = Math.max(...data.map((item) => item.revenue), 1);
  const points = data.map((item, index) => ({
    x: padding.left + (index / Math.max(1, data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (item.revenue / max) * chartHeight,
    ...item,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `M ${points[0]?.x ?? 0} ${padding.top + chartHeight} L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points.at(-1)?.x ?? 0} ${padding.top + chartHeight} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full overflow-visible" role="img" aria-label="2025 年月度销售趋势图">
        <defs>
          <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b2c" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#ff6b2c" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((index) => {
          const y = padding.top + (index / 3) * chartHeight;
          return <line key={index} x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e8ebf0" strokeDasharray="4 5" strokeWidth="1" />;
        })}
        <path d={area} fill="url(#trend-area)" />
        <polyline points={line} fill="none" stroke="#ff6b2c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 3.3} fill="#fff" stroke="#ff6b2c" strokeWidth="2.4" />
            {index % 2 === 0 || index === points.length - 1 ? (
              <text x={point.x} y={height - 6} textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"} fontSize="10" fill="#8c95a4">{point.month.slice(5)}月</text>
            ) : null}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between rounded-xl bg-[#f8f9fb] px-3 py-2.5 text-[11px] text-[#778193]">
        <span>峰值月份</span>
        <span className="font-semibold text-[#1d2939]">{data.length ? data.reduce((best, item) => (item.revenue > best.revenue ? item : best), data[0]).month : "—"}</span>
        <span>最高月销售额</span>
        <span className="font-semibold text-[#1d2939]">{data.length ? formatMoney(Math.max(...data.map((item) => item.revenue)), true) : "—"}</span>
      </div>
    </div>
  );
}

export function RegionRankingCard({ overview }: { overview: OverviewData | null }) {
  const total = overview?.regions.reduce((sum, item) => sum + item.value, 0) ?? 0;
  return (
    <section className="rounded-2xl border border-[#e1e5ec] bg-white p-4 shadow-[0_8px_22px_rgba(17,26,43,.035)] sm:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff0e8] text-[#ef6428]"><BarChart3 size={17} /></span>
        <div>
          <h2 className="text-base font-semibold">地区贡献排行</h2>
          <p className="mt-1 text-[11px] text-[#8b94a3]">2025 年销售总额</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {overview ? overview.regions.map((region, index) => {
          const share = total > 0 ? (region.value / total) * 100 : 0;
          return (
            <div key={region.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#344054]">
                  <span className={`grid h-5 w-5 place-items-center rounded-md text-[9px] font-bold ${index === 0 ? "bg-[#ff6b2c] text-white" : "bg-[#f0f2f6] text-[#7b8494]"}`}>{index + 1}</span>
                  {region.name}
                </span>
                <span className="text-[#798393]">{formatMoney(region.value, true)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#f0f2f5]">
                <div className={`h-full rounded-full ${index === 0 ? "bg-[#ff6b2c]" : "bg-[#ffb18e]"}`} style={{ width: `${Math.max(4, share)}%` }} />
              </div>
            </div>
          );
        }) : Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-1/2 animate-pulse rounded bg-[#edf0f4]" />
            <div className="h-2 animate-pulse rounded bg-[#edf0f4]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryCard({ overview }: { overview: OverviewData | null }) {
  const colors = ["bg-[#246bfd]", "bg-[#ff6b2c]", "bg-[#12a474]"];
  return (
    <section className="rounded-2xl border border-[#e1e5ec] bg-white p-4 shadow-[0_8px_22px_rgba(17,26,43,.035)] sm:p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e8f8f1] text-[#0b8f62]"><Layers3 size={17} /></span>
        <h2 className="text-base font-semibold">品类结构</h2>
      </div>
      <div className="mt-5 space-y-4">
        {overview ? overview.categories.map((category, index) => (
          <div key={category.name} className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${colors[index] ?? "bg-[#98a2b3]"}`} />
            <span className="min-w-0 flex-1 truncate text-sm text-[#4b5565]">{category.name}</span>
            <span className="text-sm font-semibold">{formatMoney(category.value, true)}</span>
          </div>
        )) : Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-5 animate-pulse rounded bg-[#edf0f4]" />)}
      </div>
      <div className="mt-5 rounded-xl bg-[#f8f9fb] px-3 py-3 text-[11px] leading-5 text-[#7c8696]">品类数据来自商品维度表，可用于判断不同业务线的收入贡献。</div>
    </section>
  );
}

export function RecentActivity({
  overview,
  onOpenHistory,
  onRerun,
}: {
  overview: OverviewData | null;
  onOpenHistory: () => void;
  onRerun: (question: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#e1e5ec] bg-white p-4 shadow-[0_8px_22px_rgba(17,26,43,.035)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">最近问数</h2>
          <p className="mt-1 text-[11px] text-[#8b94a3]">已保存的查询会在这里出现</p>
        </div>
        <button type="button" onClick={onOpenHistory} className="rounded-lg border border-[#e1e5ec] px-3 py-2 text-[11px] font-medium text-[#596273] transition hover:border-[#c6ccd6] hover:bg-[#f8f9fb]">查看全部</button>
      </div>
      <div className="mt-4 divide-y divide-[#edf0f4]">
        {overview?.history.length ? overview.history.slice(0, 4).map((item) => (
          <button type="button" key={item.id} onClick={() => onRerun(item.question)} className="group flex w-full items-center gap-3 py-3 text-left">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f4f6f9] text-[#6b7687] transition group-hover:bg-[#fff0e8] group-hover:text-[#e85d1f]"><Clock3 size={16} /></span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-[#344054]">{item.question}</span>
              <span className="mt-0.5 block text-[10px] text-[#9aa2af]">{formatClock(item.createdAt)} · {item.rowCount} 行 · {item.elapsedMs}ms</span>
            </span>
            <Play size={14} className="text-[#c0c6d0] transition group-hover:text-[#ff6b2c]" />
          </button>
        )) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f4f6f9] text-[#98a2b3]"><Sparkles size={21} /></span>
            <p className="mt-3 text-sm font-medium text-[#475467]">还没有查询记录</p>
            <p className="mt-1 max-w-[300px] text-xs leading-5 text-[#98a2b3]">从上面的示例问题开始，第一条分析会保存在这里。</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function ChartSkeleton() {
  return <div className="h-[254px] animate-pulse rounded-xl bg-[#f2f4f7]" />;
}