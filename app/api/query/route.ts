import { getD1 } from "../../../lib/d1";
import { ensureWarehouseSeed } from "../../../lib/seed";
import {
  assertSafePlan,
  buildQueryPlan,
  createInsight,
  recallMetadata,
} from "../../../lib/nl2sql";
import type { QueryPayload } from "../../../lib/api-types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type QueryBody = { question?: string };

function encodeEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  let body: QueryBody;
  try {
    body = (await request.json()) as QueryBody;
  } catch {
    return Response.json({ error: "请求格式不正确" }, { status: 400 });
  }

  const question = body.question?.trim() ?? "";
  if (!question) {
    return Response.json({ error: "请输入你想查询的问题" }, { status: 400 });
  }
  if (question.length > 300) {
    return Response.json(
      { error: "问题太长，请控制在 300 字以内" },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(encodeEvent(event, data)));
      };
      const startedAt = Date.now();

      try {
        send("stage", { label: "理解自然语言问题", status: "running" });
        const plan = buildQueryPlan(question);
        assertSafePlan(plan);

        send("stage", { label: "召回表、字段与指标元数据", status: "running" });
        const db = getD1();
        await ensureWarehouseSeed(db);
        const recall = await recallMetadata(db, question, plan.intent);
        send("stage", {
          label: `召回 ${recall.tables.length} 张表、${recall.columns.length} 个字段`,
          status: "success",
        });

        send("stage", { label: "生成并校验只读 SQL", status: "running" });
        send("stage", { label: "执行数据仓库查询", status: "running" });

        const result = await db
          .prepare(plan.sql)
          .bind(...plan.params)
          .all<Record<string, string | number | null>>();

        const rows = (result.results ?? []) as Array<
          Record<string, string | number | null>
        >;
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        const elapsedMs = Date.now() - startedAt;
        const insight = createInsight(plan, rows);
        const sessionKey =
          request.headers.get("oai-authenticated-user-id") ?? "public";

        try {
          await db.batch([
            db
              .prepare(
                "INSERT INTO query_history (id, session_key, question, sql, row_count, elapsed_ms, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
              )
              .bind(
                crypto.randomUUID(),
                sessionKey,
                question,
                plan.displaySql,
                rows.length,
                elapsedMs,
                "success",
              ),
            db.prepare(
              "DELETE FROM query_history WHERE id NOT IN (SELECT id FROM query_history ORDER BY created_at DESC LIMIT 200)",
            ),
          ]);
        } catch {
          // The answer should still be returned if history persistence fails.
        }

        const payload: QueryPayload = {
          columns,
          rows,
          sql: plan.displaySql,
          insight,
          recall,
          chart: {
            type: plan.chartType,
            dimensionKey: plan.dimensionKey,
            metricKey: plan.metricKey,
            unit: plan.chartUnit,
          },
          metricLabel: plan.metricLabel,
          dimensionLabel: plan.dimensionLabel,
          rowCount: rows.length,
          elapsedMs,
        };

        send("stage", { label: "整理分析结论", status: "running" });
        send("result", payload);
        send("done", { ok: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "查询执行失败，请稍后重试";
        send("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}