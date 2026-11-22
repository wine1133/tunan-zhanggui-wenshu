import { getD1 } from "../../../lib/d1";
import { ensureWarehouseSeed } from "../../../lib/seed";
import type { HistoryItem, OverviewData } from "../../../lib/api-types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type NumericRow = { value: number | string | null };

export async function GET() {
  try {
    const db = getD1();
    await ensureWarehouseSeed(db);

    const [
      revenueResult,
      ordersResult,
      customersResult,
      avgResult,
      trendResult,
      regionsResult,
      categoriesResult,
      historyResult,
      scaleResult,
    ] = await Promise.all([
      db
        .prepare("SELECT ROUND(SUM(order_amount), 2) AS value FROM fact_order")
        .first<NumericRow>(),
      db.prepare("SELECT COUNT(*) AS value FROM fact_order").first<NumericRow>(),
      db
        .prepare("SELECT COUNT(DISTINCT customer_id) AS value FROM fact_order")
        .first<NumericRow>(),
      db
        .prepare("SELECT ROUND(AVG(order_amount), 2) AS value FROM fact_order")
        .first<NumericRow>(),
      db
        .prepare(
          `SELECT printf('%04d-%02d', d.year, d.month) AS month,
                  ROUND(SUM(o.order_amount), 2) AS revenue,
                  COUNT(*) AS orders
           FROM fact_order o
           JOIN dim_date d ON o.date_id = d.date_id
           WHERE d.year = 2025
           GROUP BY d.year, d.month
           ORDER BY d.month`,
        )
        .all<{ month: string; revenue: number; orders: number }>(),
      db
        .prepare(
          `SELECT r.region_name AS name, ROUND(SUM(o.order_amount), 2) AS value
           FROM fact_order o
           JOIN dim_region r ON o.region_id = r.region_id
           JOIN dim_date d ON o.date_id = d.date_id
           WHERE d.year = 2025
           GROUP BY r.region_name
           ORDER BY value DESC`,
        )
        .all<{ name: string; value: number }>(),
      db
        .prepare(
          `SELECT p.category AS name, ROUND(SUM(o.order_amount), 2) AS value
           FROM fact_order o
           JOIN dim_product p ON o.product_id = p.product_id
           JOIN dim_date d ON o.date_id = d.date_id
           WHERE d.year = 2025
           GROUP BY p.category
           ORDER BY value DESC`,
        )
        .all<{ name: string; value: number }>(),
      db
        .prepare(
          `SELECT id, question, row_count, elapsed_ms, status, created_at
           FROM query_history
           ORDER BY created_at DESC
           LIMIT 8`,
        )
        .all<{
          id: string;
          question: string;
          row_count: number;
          elapsed_ms: number;
          status: string;
          created_at: string;
        }>(),
      db
        .prepare(
          `SELECT
             (SELECT COUNT(*) FROM table_info) AS tables,
             (SELECT COUNT(*) FROM fact_order) AS fact_rows`,
        )
        .first<{ tables: number; fact_rows: number }>(),
    ]);

    const history: HistoryItem[] = (historyResult.results ?? []).map((item) => ({
      id: item.id,
      question: item.question,
      rowCount: Number(item.row_count),
      elapsedMs: Number(item.elapsed_ms),
      status: item.status,
      createdAt: item.created_at,
    }));

    const payload: OverviewData = {
      source: {
        name: "兔南数据仓",
        engine: "Cloudflare D1",
        status: "online",
        tables: Number(scaleResult?.tables ?? 0),
        factRows: Number(scaleResult?.fact_rows ?? 0),
      },
      metrics: {
        revenue: Number(revenueResult?.value ?? 0),
        orders: Number(ordersResult?.value ?? 0),
        customers: Number(customersResult?.value ?? 0),
        averageOrder: Number(avgResult?.value ?? 0),
      },
      trend: (trendResult.results ?? []).map((row) => ({
        month: row.month,
        revenue: Number(row.revenue),
        orders: Number(row.orders),
      })),
      regions: (regionsResult.results ?? []).map((row) => ({
        name: row.name,
        value: Number(row.value),
      })),
      categories: (categoriesResult.results ?? []).map((row) => ({
        name: row.name,
        value: Number(row.value),
      })),
      history,
    };

    return Response.json(payload);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "概览数据加载失败" },
      { status: 500 },
    );
  }
}