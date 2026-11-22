"use client";

import {
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  LineChart,
  MessageCircle,
  Rabbit,
  ShieldCheck,
  Sparkles,
  Table2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const SLIDES = [
  {
    id: "ask",
    eyebrow: "兔南 · 智能数据工作台",
    title: "把业务问题，",
    highlight: "变成可信的数据答案",
    description:
      "用中文直接提问。兔南掌柜问数会理解业务语境，召回指标口径，生成只读 SQL，并把结果整理成表格与图表。",
    accent: "#ff8a5b",
    background:
      "radial-gradient(circle at 84% 14%, rgba(255,112,71,.28), transparent 30%), radial-gradient(circle at 52% 110%, rgba(54,104,255,.17), transparent 36%), linear-gradient(135deg, #0b1424 0%, #111d31 56%, #0c1625 100%)",
    stats: [
      ["3,655", "订单事实"],
      ["16", "成交客户"],
      ["秒级", "查询响应"],
    ],
  },
  {
    id: "trace",
    eyebrow: "从问题到 SQL，全程可追溯",
    title: "不只给答案，",
    highlight: "还让你看见答案怎么来",
    description:
      "每一次查询都会展示召回的表、字段、指标与最终 SQL。口径清晰、过程透明，分析结果可以复核，也可以继续追问。",
    accent: "#c8f27a",
    background:
      "radial-gradient(circle at 82% 18%, rgba(131,205,121,.2), transparent 30%), radial-gradient(circle at 45% 110%, rgba(40,151,180,.16), transparent 36%), linear-gradient(135deg, #0b1820 0%, #10242b 56%, #0b171f 100%)",
    stats: [
      ["4 步", "Agent 链路"],
      ["只读", "SQL 安全"],
      ["100%", "过程可见"],
    ],
  },
  {
    id: "insight",
    eyebrow: "趋势 · 结构 · 排名，一屏读懂",
    title: "让数据自己说话，",
    highlight: "决策快一步",
    description:
      "地区贡献、商品销量、月度趋势、会员客单价自动匹配最合适的呈现方式。关键变化会被直接写成结论，减少来回翻表。",
    accent: "#93b4ff",
    background:
      "radial-gradient(circle at 80% 12%, rgba(92,116,255,.25), transparent 30%), radial-gradient(circle at 48% 110%, rgba(255,121,80,.24), transparent 38%), linear-gradient(135deg, #101323 0%, #1a1831 56%, #101422 100%)",
    stats: [
      ["12", "月度节点"],
      ["5", "地区排行"],
      ["自动", "洞察生成"],
    ],
  },
];

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function focusComposer() {
  const target = document.getElementById("query");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => target?.focus(), 320);
}

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setTimeout(
      () => setActiveIndex((current) => (current + 1) % SLIDES.length),
      6200,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, reducedMotion]);

  const slide = SLIDES[activeIndex];
  const goTo = (index: number) => {
    setActiveIndex((index + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      className="carousel-shell relative overflow-hidden rounded-[30px] border border-white/10 text-white shadow-[0_26px_70px_rgba(13,24,42,.22)]"
      style={{ background: slide.background }}
      data-paused={paused}
      aria-roledescription="carousel"
      aria-label="兔南掌柜问数产品亮点"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(activeIndex - 1);
        if (event.key === "ArrowRight") goTo(activeIndex + 1);
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-20 blur-[80px]" style={{ backgroundColor: slide.accent, color: slide.accent }} />
      <div className="pointer-events-none absolute right-8 top-6 h-24 w-24 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-16 top-14 h-10 w-10 rounded-full border border-white/10" />

      <div className="relative grid min-h-[468px] items-center gap-7 px-5 pb-16 pt-7 sm:px-7 sm:pb-[76px] sm:pt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.7fr)] lg:gap-10 lg:px-10 lg:py-10 xl:px-12">
        <div key={`copy-${slide.id}`} className="carousel-content">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-white/70 backdrop-blur-sm">
            <Rabbit size={14} style={{ color: slide.accent }} />
            {slide.eyebrow}
          </div>
          <h1 className="mt-5 max-w-[680px] text-[clamp(32px,4.3vw,56px)] font-semibold leading-[1.08] tracking-[-0.045em]">
            {slide.title}
            <br />
            <span style={{ color: slide.accent }}>{slide.highlight}</span>
          </h1>
          <p className="mt-4 max-w-[590px] text-sm leading-7 text-white/58 sm:text-[15px]">{slide.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={focusComposer}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#142033] shadow-[0_12px_26px_rgba(0,0,0,.14)] transition hover:-translate-y-0.5 hover:bg-[#fff7f2]"
            >
              <MessageCircle size={17} style={{ color: "#e95d20" }} />
              开始问数
            </button>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-[11px] text-white/52">
              <ShieldCheck size={14} className="text-[#c8f27a]" />
              只读执行 · 结果可复核
            </div>
          </div>

          <div className="mt-7 grid max-w-[520px] grid-cols-3 gap-2.5">
            {slide.stats.map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/[0.08] bg-black/10 px-3 py-2.5 backdrop-blur-sm">
                <p className="text-lg font-semibold tracking-[-0.03em] text-white">{value}</p>
                <p className="mt-0.5 text-[10px] text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div key={`visual-${slide.id}`} className="carousel-visual relative mx-auto hidden w-full max-w-[520px] lg:block lg:max-w-none">
          {activeIndex === 0 ? <AskPreview /> : null}
          {activeIndex === 1 ? <TracePreview /> : null}
          {activeIndex === 2 ? <InsightPreview /> : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-5 py-4 sm:px-7 lg:px-10">
        <div className="flex items-center gap-2">
          {SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`切换到第 ${index + 1} 张：${item.eyebrow}`}
              aria-current={index === activeIndex}
              className="group flex h-7 items-center"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  index === activeIndex ? "h-2 w-10 bg-white" : "h-2 w-2 bg-white/25 group-hover:bg-white/55"
                }`}
              />
            </button>
          ))}
          <span className="ml-1 text-[10px] font-medium tabular-nums text-white/35">
            {String(activeIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-label="上一张"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-label="下一张"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {!reducedMotion ? (
        <span
          key={`progress-${activeIndex}`}
          className="carousel-progress absolute bottom-0 left-0 h-[2px] w-full"
          style={{ backgroundColor: slide.accent, color: slide.accent }}
        />
      ) : null}
    </section>
  );
}

function AskPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[450px] lg:ml-auto">
      <div className="absolute -inset-5 rounded-[30px] bg-[#ff7047]/14 blur-2xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-white/65 bg-[#fbfcfe] p-4 text-[#172033] shadow-[0_26px_55px_rgba(0,0,0,.25)]">
        <div className="flex items-center justify-between border-b border-[#e7eaf0] pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#111a2b] text-white"><Rabbit size={16} /></span>
            <div>
              <p className="text-[11px] font-semibold">兔南问数会话</p>
              <p className="text-[9px] text-[#98a2b3]">自然语言分析</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f9f1] px-2 py-1 text-[9px] font-semibold text-[#0d8a5f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />在线
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-[#111a2b] px-3 py-2.5 text-[11px] text-white/85">
          2025 年各地区销售总额是多少？
        </div>

        <div className="mt-3 grid grid-cols-[auto_1fr] gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fff0e8] text-[#e85d1f]"><Sparkles size={13} /></span>
          <div className="space-y-1.5">
            {["理解问题", "召回地区与销售指标", "生成并校验 SQL"].map((item, index) => (
              <div key={item} className="flex items-center gap-2 text-[9px] text-[#667085]">
                <span className={`grid h-4 w-4 place-items-center rounded-full ${index < 2 ? "bg-[#e8f8f1] text-[#0b8f62]" : "bg-[#fff0e8] text-[#e85d1f]"}`}>
                  {index < 2 ? <Check size={9} /> : <Zap size={9} />}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#e7eaf0] bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-[9px]">
            <span className="font-semibold text-[#475467]">地区贡献</span>
            <span className="text-[#98a2b3]">销售总额</span>
          </div>
          {[
            ["华东", 92, "¥116.1万"],
            ["华中", 82, "¥114.3万"],
            ["华南", 71, "¥107.6万"],
            ["华北", 59, "¥107.3万"],
          ].map(([name, width, value], index) => (
            <div key={name} className="mb-2 grid grid-cols-[34px_1fr_47px] items-center gap-2 last:mb-0">
              <span className="text-[8px] text-[#667085]">{name}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-[#eef1f5]">
                <span className={`block h-full rounded-full ${index === 0 ? "bg-[#ff6b2c]" : "bg-[#ffb28f]"}`} style={{ width: `${width}%` }} />
              </span>
              <span className="text-right text-[8px] font-semibold text-[#344054]">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-4 -right-2 flex items-center gap-2 rounded-xl border border-white/60 bg-white px-3 py-2 text-[10px] font-semibold text-[#142033] shadow-xl sm:right-4">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#c8f27a]"><Check size={13} /></span>
        答案已生成
      </div>
    </div>
  );
}

function TracePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[450px] lg:ml-auto">
      <div className="absolute -inset-5 rounded-[30px] bg-[#6db183]/12 blur-2xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b121b]/88 p-4 shadow-[0_26px_55px_rgba(0,0,0,.28)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#c8f27a] text-[#0d1726]"><ShieldCheck size={16} /></span>
            <div>
              <p className="text-[11px] font-semibold text-white">执行链路</p>
              <p className="text-[9px] text-white/35">Metadata → SQL → Answer</p>
            </div>
          </div>
          <span className="rounded-full border border-[#c8f27a]/20 bg-[#c8f27a]/10 px-2 py-1 text-[9px] font-semibold text-[#d9ffa9]">VERIFIED</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
            <div className="flex items-center gap-2 text-[9px] font-semibold text-white/70"><Database size={12} className="text-[#c8f27a]" />召回元数据</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {["fact_order", "dim_region", "order_amount"].map((item) => (
                <span key={item} className="rounded-md bg-white/[0.07] px-1.5 py-1 text-[8px] text-white/50">{item}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
            <div className="flex items-center gap-2 text-[9px] font-semibold text-white/70"><Table2 size={12} className="text-[#93b4ff]" />识别指标</div>
            <p className="mt-3 text-[14px] font-semibold text-white">销售总额</p>
            <p className="mt-0.5 text-[8px] text-white/35">SUM(order_amount)</p>
          </div>
        </div>

        <div className="relative mt-3 rounded-xl border border-[#c8f27a]/15 bg-[#05090e] p-3 font-mono text-[8px] leading-4 text-[#b9c7d8]">
          <span className="text-[#8ea2bb]">SELECT</span> r.region_name,<br />
          <span className="pl-3 text-[#8ea2bb]">SUM</span>(o.order_amount) <span className="text-[#8ea2bb]">AS</span> revenue<br />
          <span className="text-[#8ea2bb]">FROM</span> fact_order o<br />
          <span className="text-[#8ea2bb]">JOIN</span> dim_region r <span className="text-[#8ea2bb]">ON</span> …
          <span className="absolute right-2 top-2 rounded bg-[#c8f27a]/10 px-1.5 py-1 text-[7px] text-[#c8f27a]">READ ONLY</span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#c8f27a] px-3 py-2.5 text-[#10211d]">
          <span className="text-[9px] font-semibold">SQL 已通过白名单校验</span>
          <Check size={14} />
        </div>
      </div>
    </div>
  );
}

function InsightPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[450px] lg:ml-auto">
      <div className="absolute -inset-5 rounded-[30px] bg-[#6276ff]/15 blur-2xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-white/65 bg-[#fbfcfe] p-4 text-[#172033] shadow-[0_26px_55px_rgba(0,0,0,.25)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] text-[#98a2b3]">2025 年销售洞察</p>
            <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em]">¥1,108.8万</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ff] px-2 py-1 text-[9px] font-semibold text-[#4662d9]"><TrendingUp size={11} />稳步增长</span>
        </div>

        <div className="mt-4 rounded-xl border border-[#e7eaf0] bg-white p-3">
          <svg viewBox="0 0 320 105" className="h-[105px] w-full" aria-label="迷你销售趋势图">
            <defs>
              <linearGradient id="hero-demo-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6677ff" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#6677ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M8 87 L38 72 L68 79 L98 62 L128 69 L158 50 L188 61 L218 43 L248 57 L278 33 L312 41 L312 98 L8 98 Z" fill="url(#hero-demo-area)" />
            <polyline points="8,87 38,72 68,79 98,62 128,69 158,50 188,61 218,43 248,57 278,33 312,41" fill="none" stroke="#6677ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            {[["8","87"],["98","62"],["188","61"],["278","33"],["312","41"]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="2.8" fill="#fff" stroke="#6677ff" strokeWidth="2" />)}
          </svg>
          <div className="flex justify-between text-[7px] text-[#a2a9b4]"><span>1月</span><span>4月</span><span>7月</span><span>10月</span><span>12月</span></div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-[#111a2b] p-3 text-white">
            <div className="flex items-center gap-1.5 text-[8px] text-white/45"><BarChart3 size={10} />地区第一</div>
            <p className="mt-2 text-[13px] font-semibold">华东</p>
            <p className="mt-0.5 text-[8px] text-[#c8f27a]">贡献 21.0%</p>
          </div>
          <div className="rounded-xl bg-[#fff0e8] p-3 text-[#63240b]">
            <div className="flex items-center gap-1.5 text-[8px] text-[#a75a38]"><LineChart size={10} />峰值月份</div>
            <p className="mt-2 text-[13px] font-semibold">10 月</p>
            <p className="mt-0.5 text-[8px] text-[#d46732]">¥47.8万</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-2 max-w-[220px] rounded-xl border border-white/60 bg-white px-3 py-2.5 text-[9px] leading-4 text-[#344054] shadow-xl sm:left-3">
        <span className="mb-1 flex items-center gap-1 font-semibold text-[#e85d1f]"><Zap size={11} />自动洞察</span>
        华东贡献最高，10 月销售额达到全年峰值。
      </div>
    </div>
  );
}