"use client";

import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Rabbit,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const SLIDES = [
  {
    id: "ask",
    image: "/carousel/ask-office.jpg",
    imageAlt: "数据分析师在办公室使用笔记本电脑查看销售图表",
    overlayEyebrow: "真实业务场景",
    overlayTitle: "2025 年各地区销售总额",
    overlayPrimaryLabel: "销售总额",
    overlayPrimaryValue: "¥553.4万",
    overlaySecondaryLabel: "覆盖地区",
    overlaySecondaryValue: "5 个",
    overlayIcon: "spark",
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
    image: "/carousel/trace-screens.jpg",
    imageAlt: "专业分析人员在多屏工作台查看数据图表",
    overlayEyebrow: "SQL 执行链路",
    overlayTitle: "召回、校验、执行全程可见",
    overlayPrimaryLabel: "召回字段",
    overlayPrimaryValue: "4 个",
    overlaySecondaryLabel: "只读校验",
    overlaySecondaryValue: "通过",
    overlayIcon: "shield",
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
    image: "/carousel/insight-team-v2.jpg",
    imageAlt: "数据团队在现代办公室协作分析业务趋势",
    overlayEyebrow: "经营洞察",
    overlayTitle: "趋势、结构与排名一屏掌握",
    overlayPrimaryLabel: "趋势节点",
    overlayPrimaryValue: "12 个",
    overlaySecondaryLabel: "峰值月份",
    overlaySecondaryValue: "10 月",
    overlayIcon: "trend",
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

      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: "calc(50% - 3px) center" }} />
        <div className="absolute inset-0 bg-[#07111e]/78" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111e] via-[#07111e]/85 to-[#07111e]/25" />
      </div>
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

        <PhotoPanel slide={slide} />
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

function PhotoPanel({ slide }: { slide: (typeof SLIDES)[number] }) {
  const OverlayIcon =
    slide.overlayIcon === "shield"
      ? ShieldCheck
      : slide.overlayIcon === "trend"
        ? TrendingUp
        : Sparkles;

  return (
    <div className="carousel-visual relative hidden min-h-[390px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0b1422] shadow-[0_30px_60px_rgba(0,0,0,.3)] lg:block">
      <Image
        src={slide.image}
        alt={slide.imageAlt}
        fill
        priority
        sizes="(min-width: 1024px) 520px, 0px"
        className="object-cover"
        style={{ objectPosition: "calc(50% - 3px) center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111e] via-[#07111e]/18 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07111e]/22 via-transparent to-transparent" />

      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07111e]/55 px-3 py-1.5 text-[10px] font-medium text-white/80 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8f27a] opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c8f27a]" />
        </span>
        实时业务场景
      </div>

      <div className="absolute inset-x-4 bottom-4">
        <div className="rounded-2xl border border-white/18 bg-[#07111e]/72 p-3.5 text-white shadow-[0_16px_35px_rgba(0,0,0,.25)] backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#07111e]" style={{ backgroundColor: slide.accent }}>
              <OverlayIcon size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/45">{slide.overlayEyebrow}</p>
              <p className="mt-0.5 truncate text-[12px] font-semibold text-white">{slide.overlayTitle}</p>
            </div>
            <span className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#c8f27a]"><Check size={12} /></span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.07] px-3 py-2">
              <p className="text-[8px] text-white/38">{slide.overlayPrimaryLabel}</p>
              <p className="mt-1 text-[14px] font-semibold tracking-[-0.02em] text-white">{slide.overlayPrimaryValue}</p>
            </div>
            <div className="rounded-xl bg-white/[0.07] px-3 py-2">
              <p className="text-[8px] text-white/38">{slide.overlaySecondaryLabel}</p>
              <p className="mt-1 text-[14px] font-semibold tracking-[-0.02em] text-white">{slide.overlaySecondaryValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}