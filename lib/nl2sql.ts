import { PRODUCTS, REGIONS } from "./seed";

export type MetricKind = "amount" | "quantity" | "orders" | "average";
export type DimensionKind =
  | "region"
  | "product"
  | "category"
  | "brand"
  | "member_level"
  | "gender"
  | "customer"
  | "month"
  | "quarter"
  | "none";

export type QueryIntent = {
  question: string;
  metric: MetricKind;
  dimension: DimensionKind;
  ranking: boolean;
  topN: number;
  year?: number;
  region?: string;
  category?: string;
  brand?: string;
  product?: string;
  memberLevel?: string;
  gender?: string;
};

export type QueryPlan = {
  intent: QueryIntent;
  sql: string;
  params: Array<string | number>;
  displaySql: string;
  metricLabel: string;
  dimensionLabel: string;
  metricKey: string;
  dimensionKey?: string;
  chartType: "bar" | "line" | "none";
  chartUnit: "元" | "件" | "单";
};

export type MetadataRecall = {
  tables: Array<{ name: string; role: string }>;
  columns: Array<{ name: string; table: string; role: string }>;
  metric: { name: string; description: string } | null;
};

const METRIC_META: Record<
  MetricKind,
  { label: string; expression: string; unit: "元" | "件" | "单" }
> = {
  amount: {
    label: "销售总额",
    expression: 'ROUND(SUM(o.order_amount), 2)',
    unit: "元",
  },
  quantity: {
    label: "销量",
    expression: 'SUM(o.order_quantity)',
    unit: "件",
  },
  orders: {
    label: "订单数",
    expression: "COUNT(*)",
    unit: "单",
  },
  average: {
    label: "客单价",
    expression: "ROUND(SUM(o.order_amount) / COUNT(*), 2)",
    unit: "元",
  },
};

const DIMENSION_META: Record<
  Exclude<DimensionKind, "none">,
  { label: string; expression: string; line: boolean }
> = {
  region: { label: "地区", expression: "r.region_name", line: false },
  product: { label: "商品", expression: "p.product_name", line: false },
  category: { label: "品类", expression: "p.category", line: false },
  brand: { label: "品牌", expression: "p.brand", line: false },
  member_level: {
    label: "会员等级",
    expression: "c.member_level",
    line: false,
  },
  gender: { label: "性别", expression: "c.gender", line: false },
  customer: { label: "客户", expression: "c.customer_name", line: false },
  month: {
    label: "月份",
    expression: 'printf(\'%04d-%02d\', d.year, d.month)',
    line: true,
  },
  quarter: {
    label: "季度",
    expression: 'd.year || \'-\' || d.quarter',
    line: true,
  },
};

const STOP_WORDS = [
  "统计",
  "查询",
  "分析",
  "一下",
  "以及",
  "什么",
  "哪些",
  "多少",
  "请问",
  "帮我",
  "看一下",
  "数据",
  "情况",
];

function detectMetric(question: string): MetricKind {
  if (/客单价|平均订单|平均每单|AOV/i.test(question)) return "average";
  if (/销量|件数|数量|卖出/.test(question)) return "quantity";
  if (/订单数|单量|笔数|多少单/.test(question)) return "orders";
  return "amount";
}

function detectDimension(question: string): DimensionKind {
  if (/每月|月度|按月|月份趋势|月度趋势/.test(question)) return "month";
  if (/每季|季度趋势|按季度|各季度/.test(question)) return "quarter";
  if (/会员等级|各等级|按等级/.test(question)) return "member_level";
  if (/性别|男性|女性/.test(question)) return "gender";
  if (/客户.*(排行|排名|消费)|各客户|按客户/.test(question)) return "customer";
  if (/品类|类别/.test(question)) return "category";
  if (/品牌/.test(question)) return "brand";
  if (/商品|产品/.test(question)) return "product";
  if (/地区|区域|大区/.test(question)) return "region";
  return "none";
}

function detectYear(question: string): number | undefined {
  const explicit = question.match(/(20\d{2})\s*年?/);
  if (explicit) return Number(explicit[1]);
  if (/去年|上一年/.test(question)) return 2025;
  if (/前年/.test(question)) return 2024;
  return undefined;
}

function detectRegion(question: string): string | undefined {
  return REGIONS.map((region) => region.name).find((name) =>
    question.includes(name),
  );
}

function detectProduct(question: string): string | undefined {
  const product = PRODUCTS.find(([, name]) => {
    const core = name.replace(/^(星环|云雀|极光|守望|青禾|森呼吸|山海|墨影|薄雾|明眸)/, "");
    return question.includes(name) || (core.length >= 2 && question.includes(core));
  });
  return product?.[1];
}

function detectCategory(question: string): string | undefined {
  return ["数码", "智能家居", "办公"].find((category) =>
    question.includes(category),
  );
}

function detectBrand(question: string): string | undefined {
  return ["星辰", "云启", "极光", "远山", "青禾"].find((brand) =>
    question.includes(brand),
  );
}

function detectMemberLevel(question: string): string | undefined {
  return ["普通会员", "黄金会员", "铂金会员", "钻石会员"].find((level) =>
    question.includes(level),
  );
}

function detectGender(question: string): string | undefined {
  if (/男性|男客户|男会员|男士/.test(question)) return "男";
  if (/女性|女客户|女会员|女士/.test(question)) return "女";
  return undefined;
}

function extractTopN(question: string): number {
  const numeric = question.match(/前\s*(\d{1,2})|top\s*(\d{1,2})/i);
  if (numeric) {
    return Math.min(20, Math.max(1, Number(numeric[1] ?? numeric[2])));
  }
  if (/前三|top\s*3/i.test(question)) return 3;
  if (/前五|top\s*5/i.test(question)) return 5;
  if (/前十|top\s*10/i.test(question)) return 10;
  return 3;
}

export function parseQuestion(question: string): QueryIntent {
  const normalized = question.trim();
  let dimension = detectDimension(normalized);
  const metric = detectMetric(normalized);
  const ranking = /排行|排名|前三|前五|top\s*\d|最多|最好/.test(normalized);
  const topN = extractTopN(normalized);

  if (
    dimension === "none" &&
    /各地区|各区域|按地区|按区域|每个地区/.test(normalized)
  ) {
    dimension = "region";
  }
  if (
    dimension === "none" &&
    /各商品|按商品|每种商品|各产品|按产品/.test(normalized)
  ) {
    dimension = "product";
  }
  if (dimension === "none" && ranking) {
    if (/商品|产品/.test(normalized)) dimension = "product";
    else if (/客户|用户/.test(normalized)) dimension = "customer";
    else dimension = "region";
  }

  const asksForTotal = /总额|总计|合计|总共|整体|一共/.test(normalized);
  const explicitlyGrouped = /各|按|每个|分别|排名|排行/.test(normalized);
  if (asksForTotal && !explicitlyGrouped && !ranking) {
    dimension = "none";
  }
  if (
    dimension === "none" &&
    !ranking &&
    !asksForTotal &&
    /销售|营收|成交|订单|客户/.test(normalized)
  ) {
    dimension = "region";
  }

  return {
    question: normalized,
    metric,
    dimension,
    ranking,
    topN,
    year: detectYear(normalized),
    region: detectRegion(normalized),
    category: detectCategory(normalized),
    brand: detectBrand(normalized),
    product: detectProduct(normalized),
    memberLevel: detectMemberLevel(normalized),
    gender: detectGender(normalized),
  };
}

function buildWhere(intent: QueryIntent) {
  const clauses: string[] = [];
  const params: Array<string | number> = [];

  if (intent.year) {
    clauses.push("d.year = ?");
    params.push(intent.year);
  }
  if (intent.region) {
    clauses.push("r.region_name = ?");
    params.push(intent.region);
  }
  if (intent.category) {
    clauses.push("p.category = ?");
    params.push(intent.category);
  }
  if (intent.brand) {
    clauses.push("p.brand = ?");
    params.push(intent.brand);
  }
  if (intent.product) {
    clauses.push("p.product_name = ?");
    params.push(intent.product);
  }
  if (intent.memberLevel) {
    clauses.push("c.member_level = ?");
    params.push(intent.memberLevel);
  }
  if (intent.gender) {
    clauses.push("c.gender = ?");
    params.push(intent.gender);
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

function escapeSqlLiteral(value: string | number) {
  if (typeof value === "number") return String(value);
  return `'${value.replaceAll("'", "''")}'`;
}

export function renderSql(sql: string, params: Array<string | number>) {
  let index = 0;
  return sql.replace(/\?/g, () => escapeSqlLiteral(params[index++] ?? ""));
}

export function buildQueryPlan(question: string): QueryPlan {
  const intent = parseQuestion(question);
  const metric = METRIC_META[intent.metric];
  const where = buildWhere(intent);
  const joins = [
    "FROM fact_order o",
    "JOIN dim_region r ON o.region_id = r.region_id",
    "JOIN dim_product p ON o.product_id = p.product_id",
    "JOIN dim_date d ON o.date_id = d.date_id",
    "JOIN dim_customer c ON o.customer_id = c.customer_id",
  ].join("\n");

  if (intent.dimension === "none") {
    const sql = `SELECT ${metric.expression} AS "${metric.label}"\n${joins}\n${where.sql}`;
    return {
      intent,
      sql,
      params: where.params,
      displaySql: renderSql(sql, where.params),
      metricLabel: metric.label,
      metricKey: metric.label,
      dimensionLabel: "汇总",
      chartType: "none",
      chartUnit: metric.unit,
    };
  }

  const dimension = DIMENSION_META[intent.dimension];
  const perRegionProductRanking =
    intent.ranking &&
    intent.topN > 0 &&
    /地区|区域/.test(intent.question) &&
    /商品|产品/.test(intent.question);

  if (perRegionProductRanking) {
    const sql = `WITH ranked AS (\n  SELECT\n    r.region_name AS region_name,\n    p.product_name AS product_name,\n    ${metric.expression} AS metric_value,\n    ROW_NUMBER() OVER (PARTITION BY r.region_name ORDER BY ${metric.expression} DESC) AS rn\n  ${joins.replaceAll("\n", "\n  ")}\n  ${where.sql.replaceAll("\n", "\n  ")}\n  GROUP BY r.region_name, p.product_name\n)\nSELECT region_name AS "地区", product_name AS "商品", metric_value AS "${metric.label}"\nFROM ranked\nWHERE rn <= ?\nORDER BY "地区", rn`;
    const params = [...where.params, intent.topN];
    return {
      intent,
      sql,
      params,
      displaySql: renderSql(sql, params),
      metricLabel: metric.label,
      dimensionLabel: "地区 / 商品",
      metricKey: metric.label,
      dimensionKey: "地区",
      chartType: "bar",
      chartUnit: metric.unit,
    };
  }

  const groupExpression = dimension.expression;
  const orderBy = dimension.line
    ? `${groupExpression} ASC`
    : `"${metric.label}" DESC`;
  const limit = intent.ranking ? intent.topN : 20;
  const sql = `SELECT ${groupExpression} AS "${dimension.label}", ${metric.expression} AS "${metric.label}"\n${joins}\n${where.sql}\nGROUP BY ${groupExpression}\nORDER BY ${orderBy}\nLIMIT ?`;
  const params = [...where.params, limit];

  return {
    intent,
    sql,
    params,
    displaySql: renderSql(sql, params),
    metricLabel: metric.label,
    dimensionLabel: dimension.label,
    metricKey: metric.label,
    dimensionKey: dimension.label,
    chartType: dimension.line ? "line" : "bar",
    chartUnit: metric.unit,
  };
}

export function assertSafePlan(plan: QueryPlan) {
  const sql = plan.sql.trim();
  const upper = sql.toUpperCase();
  if (!upper.startsWith("SELECT") && !upper.startsWith("WITH")) {
    throw new Error("仅允许执行只读查询");
  }
  if (/;\s*\S/.test(sql) || /--|\/\*/.test(sql)) {
    throw new Error("SQL 中包含不允许的语句");
  }
  const forbidden = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|ATTACH|DETACH|PRAGMA)\b/i;
  if (forbidden.test(sql)) {
    throw new Error("SQL 中包含写操作");
  }
}

function tokenize(question: string) {
  const stripped = STOP_WORDS.reduce(
    (value, word) => value.replaceAll(word, " "),
    question,
  );
  return stripped
    .split(/[\s,，。！？?、：:；;]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

export async function recallMetadata(
  db: D1Database,
  question: string,
  intent: QueryIntent,
): Promise<MetadataRecall> {
  const [tableResult, columnResult, metricResult] = await Promise.all([
    db.prepare("SELECT id, name, role FROM table_info").all<{
      id: string;
      name: string;
      role: string;
    }>(),
    db
      .prepare(
        "SELECT id, name, role, alias, description, table_id FROM column_info",
      )
      .all<{
        id: string;
        name: string;
        role: string;
        alias: string;
        description: string;
        table_id: string;
      }>(),
    db
      .prepare("SELECT id, name, description, alias FROM metric_info")
      .all<{
        id: string;
        name: string;
        description: string;
        alias: string;
      }>(),
  ]);

  const tokens = tokenize(question);
  const tableNames = new Map(
    (tableResult.results ?? []).map((row) => [row.id, row.name]),
  );

  const scoredColumns = (columnResult.results ?? [])
    .map((column) => {
      const aliases = parseJsonArray(column.alias);
      let score = 0;
      for (const token of tokens) {
        if (column.description.includes(token)) score += 3;
        if (aliases.some((alias) => alias.includes(token) || token.includes(alias))) {
          score += 5;
        }
      }
      if (
        intent.metric === "amount" &&
        column.name === "order_amount"
      ) {
        score += 8;
      }
      if (
        intent.metric === "quantity" &&
        column.name === "order_quantity"
      ) {
        score += 8;
      }
      if (intent.dimension === "region" && column.name === "region_name") {
        score += 5;
      }
      if (intent.dimension === "product" && column.name === "product_name") {
        score += 5;
      }
      return { ...column, score };
    })
    .sort((a, b) => b.score - a.score);

  const tableScores = new Map<string, number>();
  for (const column of scoredColumns) {
    tableScores.set(
      column.table_id,
      (tableScores.get(column.table_id) ?? 0) + column.score,
    );
  }
  tableScores.set("T05", (tableScores.get("T05") ?? 0) + 10);

  const tables = [...tableScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => ({
      name: tableNames.get(id) ?? id,
      role: (tableResult.results ?? []).find((row) => row.id === id)?.role ?? "dim",
    }));

  const columns = scoredColumns
    .filter((column) => column.score > 0)
    .slice(0, 4)
    .map((column) => ({
      name: column.name,
      table: tableNames.get(column.table_id) ?? column.table_id,
      role: column.role,
    }));

  const metricAliases = (metricResult.results ?? []).map((metric) => {
    const aliases = parseJsonArray(metric.alias);
    const score =
      (intent.metric === "amount" && metric.id === "M01" ? 10 : 0) +
      (intent.metric === "quantity" && metric.id === "M02" ? 10 : 0) +
      (intent.metric === "orders" && metric.id === "M03" ? 10 : 0) +
      (intent.metric === "average" && metric.id === "M04" ? 10 : 0) +
      tokens.reduce(
        (sum, token) =>
          sum +
          (aliases.some((alias) => alias.includes(token) || token.includes(alias))
            ? 5
            : 0),
        0,
      );
    return { ...metric, score };
  });

  const bestMetric = metricAliases.sort((a, b) => b.score - a.score)[0];
  return {
    tables: tables.length ? tables : [{ name: "fact_order", role: "fact" }],
    columns:
      columns.length > 0
        ? columns
        : [{ name: "order_amount", table: "fact_order", role: "measure" }],
    metric: bestMetric
      ? { name: bestMetric.name, description: bestMetric.description }
      : null,
  };
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function createInsight(
  plan: QueryPlan,
  rows: Array<Record<string, unknown>>,
) {
  if (rows.length === 0) {
    return "没有找到符合条件的数据，可以换一个年份、地区或分析维度试试。";
  }

  const metricValue = rows[0][plan.metricKey];
  if (plan.intent.dimension === "none") {
    return `本次查询的${plan.metricLabel}为 ${formatMetric(metricValue, plan.chartUnit)}。`;
  }

  if (plan.dimensionLabel === "地区 / 商品") {
    const regions = new Set(rows.map((row) => String(row["地区"])));
    return `已按 ${regions.size} 个地区分别返回销量前三的商品，共 ${rows.length} 条结果。`;
  }

  const first = rows[0];
  const label = plan.dimensionKey ? first[plan.dimensionKey] : "第一项";
  const topMetric = first[plan.metricKey];
  const total = rows.reduce((sum, row) => sum + Number(row[plan.metricKey] ?? 0), 0);
  const share = total > 0 ? (Number(topMetric) / total) * 100 : 0;

  if (plan.chartType === "line" && rows.length > 1) {
    const start = Number(rows[0][plan.metricKey] ?? 0);
    const end = Number(rows[rows.length - 1][plan.metricKey] ?? 0);
    const change = start === 0 ? 0 : ((end - start) / start) * 100;
    return `${plan.dimensionLabel}趋势共 ${rows.length} 个节点，末期较首期${change >= 0 ? "增长" : "下降"} ${Math.abs(change).toFixed(1)}%。`;
  }

  const shareText =
    plan.intent.metric === "amount" && share > 0 ? `，占当前结果约 ${share.toFixed(1)}%` : "";
  return `${label} 的${plan.metricLabel}最高，为 ${formatMetric(topMetric, plan.chartUnit)}${shareText}。`;
}

export function formatMetric(value: unknown, unit: "元" | "件" | "单") {
  const number = Number(value ?? 0);
  if (unit === "元") {
    return `¥${number.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
  }
  return `${number.toLocaleString("zh-CN", { maximumFractionDigits: 0 })} ${unit}`;
}