"use client";

import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CatalogData, OverviewData } from "../lib/api-types";
import type { QueryEntry, Stage, ViewKey } from "./app-types";
import Sidebar from "./sidebar";
import WorkbenchView from "./workbench";
import { CatalogView, HistoryView, MetricsView } from "./data-views";

const VIEW_LABELS: Record<ViewKey, string> = {
  workbench: "问数工作台",
  catalog: "数据地图",
  metrics: "指标中心",
  history: "查询历史",
};

export default function AskDataApp() {
  const [activeView, setActiveView] = useState<ViewKey>("workbench");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState<QueryEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const overviewResponse = await fetch("/api/overview");
        if (!overviewResponse.ok) {
          const body = (await overviewResponse.json()) as { error?: string };
          throw new Error(body.error ?? "数据概览加载失败");
        }
        const nextOverview = (await overviewResponse.json()) as OverviewData;
        if (!cancelled) setOverview(nextOverview);

        const catalogResponse = await fetch("/api/catalog");
        if (!catalogResponse.ok) {
          const body = (await catalogResponse.json()) as { error?: string };
          throw new Error(body.error ?? "数据地图加载失败");
        }
        const nextCatalog = (await catalogResponse.json()) as CatalogData;
        if (!cancelled) setCatalog(nextCatalog);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "页面加载失败");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshOverview() {
    try {
      const response = await fetch("/api/overview", { cache: "no-store" });
      if (response.ok) setOverview((await response.json()) as OverviewData);
    } catch {
      // Keep the current overview when refresh fails.
    }
  }

  async function runQuery(rawQuestion: string) {
    const nextQuestion = rawQuestion.trim();
    if (!nextQuestion || isRunning) return;

    setQuestion("");
    setActiveView("workbench");
    setMobileNavOpen(false);
    setIsRunning(true);
    const id = crypto.randomUUID();
    setEntries((current) => [...current, { id, question: nextQuestion, status: "running", stages: [] }]);
    window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion }),
      });

      if (!response.ok || !response.body) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "查询请求失败");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const applyEvent = (eventName: string, data: unknown) => {
        if (eventName === "stage") {
          const stage = data as Stage;
          setEntries((current) =>
            current.map((entry) => {
              if (entry.id !== id) return entry;
              const stages = entry.stages.map((item) =>
                item.status === "running" ? { ...item, status: "success" as const } : item,
              );
              if (stage.status === "success" && stages.some((item) => item.label === stage.label)) {
                return { ...entry, stages };
              }
              return { ...entry, stages: [...stages, stage] };
            }),
          );
        }
        if (eventName === "result") {
          const result = data as QueryEntry["result"];
          setEntries((current) =>
            current.map((entry) => {
              if (entry.id !== id) return entry;
              return {
                ...entry,
                status: "success",
                result,
                stages: entry.stages.map((item) =>
                  item.status === "running" ? { ...item, status: "success" as const } : item,
                ),
              };
            }),
          );
        }
        if (eventName === "error") {
          const error = (data as { message?: string }).message ?? "查询失败";
          setEntries((current) =>
            current.map((entry) => {
              if (entry.id !== id) return entry;
              return {
                ...entry,
                status: "error",
                error,
                stages: entry.stages.map((item) =>
                  item.status === "running" ? { ...item, status: "error" as const } : item,
                ),
              };
            }),
          );
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";
        for (const block of blocks) {
          const lines = block.split("\n");
          const eventName = lines.find((line) => line.startsWith("event:"))?.slice(6).trim() ?? "message";
          const dataText = lines.filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
          if (!dataText) continue;
          try {
            applyEvent(eventName, JSON.parse(dataText));
          } catch {
            // Ignore a malformed event; later events can still render.
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "查询失败，请稍后再试";
      setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, status: "error", error: message } : entry)));
    } finally {
      setIsRunning(false);
      void refreshOverview();
      window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runQuery(question);
  }

  function switchView(view: ViewKey) {
    setActiveView(view);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-[#142033]">
      <Sidebar activeView={activeView} onSwitch={switchView} mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} overview={overview} />

      <main className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-[#dfe3ea] bg-[#f7f8fa]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1540px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileNavOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#d9dee7] bg-white text-[#344054] lg:hidden" aria-label="打开导航"><Menu size={19} /></button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[13px] text-[#7b8494]">
                  <span>兔南掌柜问数</span><span className="text-[#c0c5ce]">/</span><span className="truncate text-[#344054]">{VIEW_LABELS[activeView]}</span>
                </div>
                <p className="mt-0.5 hidden text-xs text-[#98a1b0] sm:block">Natural language analytics workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden items-center gap-2 rounded-full border border-[#dce1e9] bg-white px-3 py-2 text-xs font-medium text-[#475467] sm:flex">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
                数据仓在线
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#172033] text-sm font-semibold text-white">Z</div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1540px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          {loadError ? <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{loadError}</span></div> : null}
          {activeView === "workbench" ? (
            <WorkbenchView
              overview={overview}
              entries={entries}
              question={question}
              setQuestion={setQuestion}
              isRunning={isRunning}
              onSubmit={handleSubmit}
              onExample={(value) => void runQuery(value)}
              bottomRef={bottomRef}
              onOpenHistory={() => switchView("history")}
            />
          ) : null}
          {activeView === "catalog" ? <CatalogView catalog={catalog} /> : null}
          {activeView === "metrics" ? <MetricsView catalog={catalog} /> : null}
          {activeView === "history" ? <HistoryView items={overview?.history ?? []} onRerun={(value) => void runQuery(value)} isRunning={isRunning} /> : null}
        </div>
      </main>
    </div>
  );
}