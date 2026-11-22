import { getD1 } from "../../../lib/d1";
import { ensureWarehouseSeed } from "../../../lib/seed";
import type { CatalogData } from "../../../lib/api-types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function parseArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const db = getD1();
    await ensureWarehouseSeed(db);

    const [tableResult, columnResult, metricResult] = await Promise.all([
      db
        .prepare("SELECT id, name, role, description FROM table_info ORDER BY rowid")
        .all<{ id: string; name: string; role: string; description: string }>(),
      db
        .prepare(
          "SELECT name, type, role, description, alias, table_id FROM column_info ORDER BY rowid",
        )
        .all<{
          name: string;
          type: string;
          role: string;
          description: string;
          alias: string;
          table_id: string;
        }>(),
      db
        .prepare("SELECT id, name, description, alias FROM metric_info ORDER BY rowid")
        .all<{ id: string; name: string; description: string; alias: string }>(),
    ]);

    const columns = columnResult.results ?? [];
    const payload: CatalogData = {
      tables: (tableResult.results ?? []).map((table) => ({
        id: table.id,
        name: table.name,
        role: table.role,
        description: table.description,
        columns: columns
          .filter((column) => column.table_id === table.id)
          .map((column) => ({
            name: column.name,
            type: column.type,
            role: column.role,
            description: column.description,
            alias: parseArray(column.alias),
          })),
      })),
      metrics: (metricResult.results ?? []).map((metric) => ({
        id: metric.id,
        name: metric.name,
        description: metric.description,
        alias: parseArray(metric.alias),
      })),
    };

    return Response.json(payload);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "元数据加载失败" },
      { status: 500 },
    );
  }
}