"use client";

import {

  ChevronDown,
  Database,
  Gauge,
  History,
  Rabbit,
  LayoutDashboard,
  ShieldCheck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OverviewData } from "../lib/api-types";
import type { ViewKey } from "./app-types";
import { formatNumber } from "../lib/ui-utils";

const ITEMS: Array<{ key: ViewKey; label: string; icon: LucideIcon }> = [
  { key: "workbench", label: "问数工作台", icon: LayoutDashboard },
  { key: "catalog", label: "数据地图", icon: Database },
  { key: "metrics", label: "指标中心", icon: Gauge },
  { key: "history", label: "查询历史", icon: History },
];

export default function Sidebar({
  activeView,
  onSwitch,
  mobileOpen,
  onClose,
  overview,
}: {
  activeView: ViewKey;
  onSwitch: (view: ViewKey) => void;
  mobileOpen: boolean;
  onClose: () => void;
  overview: OverviewData | null;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="关闭导航遮罩"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[#0b1220]/55 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col overflow-hidden bg-[#101827] text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-[#ff6b2c]/20 blur-3xl" />

        <div className="relative flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <button
            type="button"
            onClick={() => onSwitch("workbench")}
            className="flex items-center gap-3 text-left"
            aria-label="返回问数工作台"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-[13px] bg-[#ff6b2c] shadow-[0_10px_30px_rgba(255,107,44,.35)]">
              <Rabbit size={21} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[17px] font-semibold tracking-tight">兔南掌柜问数</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">Data Copilot</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 lg:hidden"
            aria-label="关闭导航"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-6 scrollbar-thin">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">工作空间</p>
          <div className="space-y-1.5">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.key;
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => onSwitch(item.key)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    active
                      ? "bg-white text-[#101827] shadow-[0_10px_26px_rgba(0,0,0,.16)]"
                      : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-lg ${active ? "bg-[#fff1e9] text-[#e85d1f]" : "bg-white/5 text-white/55"}`}>
                    <Icon size={17} />
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {item.key === "workbench" ? (
                    <span className={`ml-auto h-1.5 w-1.5 rounded-full ${active ? "bg-[#ff6b2c]" : "bg-[#ff6b2c]/70"}`} />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/55">数据源</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Online
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c9f27b] text-[#172033]">
                <Database size={19} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">兔南数据仓</p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {overview ? `${formatNumber(overview.source.factRows)} 条订单` : "正在连接..."}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-black/15 px-3 py-2">
                <p className="text-[10px] text-white/35">物理表</p>
                <p className="mt-0.5 text-sm font-semibold">{overview?.source.tables ?? 5}</p>
              </div>
              <div className="rounded-lg bg-black/15 px-3 py-2">
                <p className="text-[10px] text-white/35">查询引擎</p>
                <p className="mt-0.5 text-xs font-semibold">D1 SQL</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#c9f27b]/15 bg-[#c9f27b]/[0.06] px-3 py-3">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#c9f27b]" />
            <p className="text-[11px] leading-5 text-white/45">查询只读执行，生成 SQL 会经过白名单校验。</p>
          </div>
        </nav>

        <div className="relative border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#ff9b6a] to-[#ff5f1f] text-xs font-bold">ZG</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">数据运营团队</p>
              <p className="mt-0.5 text-[10px] text-white/35">Public demo workspace</p>
            </div>
            <ChevronDown size={15} className="text-white/35" />
          </div>
        </div>
      </aside>
    </>
  );
}