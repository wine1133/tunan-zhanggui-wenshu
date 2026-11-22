"use client";

import {
  CircleDollarSign,
  Database,
  Gauge,
  History,
  Network,
  Play,
  ShieldCheck,
  ShoppingBag,
  Table2,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CatalogData, HistoryItem } from "../lib/api-types";
import { ROLE_LABELS, formatClock } from "../lib/ui-utils";

export function CatalogView({ catalog }: { catalog: CatalogData | null }) {
  return (
    <div className="space-y-5">
      <PageHeading eyebrow="Metadata Catalog" title="数据地图" description="查看数据仓库中的物理表、字段角色与业务口径，理解每个问题背后的数据来源。" icon={Network} />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["物理表", catalog?.tables.length ?? "—", "星型模型"],
          ["字段数", catalog?.tables.reduce((sum, table) => sum + table.columns.length, 0) ?? "—", "含主外键与度量"],
          ["指标数", catalog?.metrics.length ?? "—", "人工治理口径"],
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-[#e1e5ec] bg-white p-4">
            <p className="text-xs text-[#7b8494]">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            <p className="mt-2 text-[11px] text-[#a0a7b4]">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {catalog ? catalog.tables.map((table) => (
          <section key={table.id} className="overflow-hidden rounded-2xl border border-[#e1e5ec] bg-white shadow-[0_8px_22px_rgba(17,26,43,.035)]">
            <div className="flex items-start gap-3 border-b border-[#edf0f4] px-5 py-4">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${table.role === "fact" ? "bg-[#fff0e8] text-[#ef6428]" : "bg-[#eaf1ff] text-[#246bfd]"}`}>{table.role === "fact" ? <ShoppingBag size={18} /> : <Database size={18} />}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-sm font-semibold text-[#1d2939]">{table.name}</h2>
                  <span className="rounded-full bg-[#f4f6f9] px-2 py-0.5 text-[9px] font-semibold text-[#667085]">{ROLE_LABELS[table.role] ?? table.role}</span>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-[#8b94a3]">{table.description}</p>
              </div>
            </div>
            <div className="divide-y divide-[#f0f2f5]">
              {table.columns.map((column) => (
                <div key={`${table.name}-${column.name}`} className="grid grid-cols-[minmax(100px,.8fr)_70px_minmax(0,1.2fr)] gap-3 px-5 py-3 text-[11px]">
                  <div className="min-w-0">
                    <span className="block truncate font-mono font-semibold text-[#344054]">{column.name}</span>
                    <span className="mt-0.5 block text-[9px] text-[#a0a7b4]">{column.type}</span>
                  </div>
                  <span className={`mt-0.5 h-fit w-fit rounded-full px-2 py-0.5 text-[9px] font-medium ${column.role === "measure" ? "bg-[#fff0e8] text-[#d95218]" : column.role === "dimension" ? "bg-[#eaf1ff] text-[#345cd1]" : "bg-[#f0f2f5] text-[#667085]"}`}>{ROLE_LABELS[column.role] ?? column.role}</span>
                  <span className="leading-5 text-[#7b8494]">{column.description}</span>
                </div>
              ))}
            </div>
          </section>
        )) : Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl border border-[#e1e5ec] bg-white" />)}
      </div>
    </div>
  );
}

export function MetricsView({ catalog }: { catalog: CatalogData | null }) {
  return (
    <div className="space-y-5">
      <PageHeading eyebrow="Metric Layer" title="指标中心" description="统一维护指标名称、业务含义、计算口径与常见别名，减少同名不同口径的问题。" icon={Gauge} />
      <div className="grid gap-4 md:grid-cols-2">
        {catalog ? catalog.metrics.map((metric, index) => (
          <section key={metric.id} className="rounded-2xl border border-[#e1e5ec] bg-white p-5 shadow-[0_8px_22px_rgba(17,26,43,.035)]">
            <div className="flex items-start justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${index === 0 ? "bg-[#fff0e8] text-[#ef6428]" : index === 1 ? "bg-[#eaf1ff] text-[#246bfd]" : index === 2 ? "bg-[#e8f8f1] text-[#0b8f62]" : "bg-[#f1ecff] text-[#6c4ce0]"}`}>{index === 0 ? <CircleDollarSign size={19} /> : index === 1 ? <ShoppingBag size={19} /> : index === 2 ? <Table2 size={19} /> : <TrendingUp size={19} />}</span>
              <span className="font-mono text-[10px] text-[#a0a7b4]">{metric.id}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{metric.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{metric.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {metric.alias.map((alias) => <span key={alias} className="rounded-full bg-[#f4f6f9] px-2.5 py-1 text-[10px] font-medium text-[#667085]">{alias}</span>)}
            </div>
          </section>
        )) : Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl border border-[#e1e5ec] bg-white" />)}
      </div>
      <div className="rounded-2xl border border-[#e1e5ec] bg-white p-5">
        <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#0b8f62]" /><h2 className="font-semibold">口径治理原则</h2></div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["唯一口径", "同名指标只保留一个权威定义，业务别名映射到标准指标。"],
            ["可追溯", "指标依赖字段与物理表建立关联，生成 SQL 时有据可查。"],
            ["可校验", "答案附带生成 SQL 与召回元数据，方便复核分析过程。"],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl bg-[#f8f9fb] p-4">
              <p className="text-sm font-semibold text-[#344054]">{title}</p>
              <p className="mt-1.5 text-[11px] leading-5 text-[#8b94a3]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HistoryView({ items, onRerun, isRunning }: { items: HistoryItem[]; onRerun: (question: string) => void; isRunning: boolean }) {
  return (
    <div className="space-y-5">
      <PageHeading eyebrow="Query Log" title="查询历史" description="最近执行的问数请求会保存在数据库中。点击任一记录即可重新运行，观察最新结果。" icon={History} />
      <section className="overflow-hidden rounded-2xl border border-[#e1e5ec] bg-white shadow-[0_8px_22px_rgba(17,26,43,.035)]">
        <div className="grid grid-cols-[minmax(0,1fr)_48px] gap-3 border-b border-[#edf0f4] bg-[#fafbfc] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#98a2b3] sm:grid-cols-[minmax(0,1fr)_90px_90px_120px_48px] sm:px-6">
          <span>问题</span><span className="hidden sm:block">结果行数</span><span className="hidden sm:block">耗时</span><span className="hidden sm:block">时间</span><span />
        </div>
        {items.length ? (
          <div className="divide-y divide-[#edf0f4]">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_48px] items-center gap-3 px-4 py-4 text-xs sm:grid-cols-[minmax(0,1fr)_90px_90px_120px_48px] sm:px-6">
                <div className="min-w-0"><p className="truncate font-medium text-[#344054]">{item.question}</p><p className="mt-1 text-[10px] text-[#98a2b3] sm:hidden">{item.rowCount} 行 · {item.elapsedMs}ms</p></div>
                <span className="hidden text-[#667085] sm:block">{item.rowCount}</span>
                <span className="hidden text-[#667085] sm:block">{item.elapsedMs}ms</span>
                <span className="hidden text-[10px] text-[#8b94a3] sm:block">{formatClock(item.createdAt)}</span>
                <button type="button" onClick={() => onRerun(item.question)} disabled={isRunning} className="grid h-9 w-9 place-items-center rounded-lg bg-[#f4f6f9] text-[#667085] transition hover:bg-[#fff0e8] hover:text-[#e85d1f] disabled:opacity-40" aria-label="重新运行查询"><Play size={14} /></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f4f6f9] text-[#98a2b3]"><History size={24} /></span>
            <p className="mt-4 text-base font-semibold text-[#344054]">暂无查询历史</p>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#98a2b3]">回到问数工作台提交一个问题，执行记录会自动写入 D1 数据库。</p>
          </div>
        )}
      </section>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: LucideIcon }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#e1e5ec] bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#101827] text-[#c9f27b]"><Icon size={22} /></span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ff6b2c]">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#7b8494]">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-[#f7f8fa] px-3 py-2 text-[10px] text-[#7b8494]"><ShieldCheck size={13} className="text-[#0b8f62]" />只读查询空间</div>
    </section>
  );
}