export type HistoryItem = {
  id: string;
  question: string;
  rowCount: number;
  elapsedMs: number;
  status: string;
  createdAt: string;
};

export type OverviewData = {
  source: {
    name: string;
    engine: string;
    status: "online";
    tables: number;
    factRows: number;
  };
  metrics: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrder: number;
  };
  trend: Array<{ month: string; revenue: number; orders: number }>;
  regions: Array<{ name: string; value: number }>;
  categories: Array<{ name: string; value: number }>;
  history: HistoryItem[];
};

export type CatalogData = {
  tables: Array<{
    id: string;
    name: string;
    role: string;
    description: string;
    columns: Array<{
      name: string;
      type: string;
      role: string;
      description: string;
      alias: string[];
    }>;
  }>;
  metrics: Array<{
    id: string;
    name: string;
    description: string;
    alias: string[];
  }>;
};

export type QueryPayload = {
  columns: string[];
  rows: Array<Record<string, string | number | null>>;
  sql: string;
  insight: string;
  recall: {
    tables: Array<{ name: string; role: string }>;
    columns: Array<{ name: string; table: string; role: string }>;
    metric: { name: string; description: string } | null;
  };
  chart: {
    type: "bar" | "line" | "none";
    dimensionKey?: string;
    metricKey: string;
    unit: "元" | "件" | "单";
  };
  metricLabel: string;
  dimensionLabel: string;
  rowCount: number;
  elapsedMs: number;
};