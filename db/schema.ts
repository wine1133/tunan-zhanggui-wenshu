import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const dimDate = sqliteTable("dim_date", {
  dateId: integer("date_id").primaryKey(),
  year: integer("year").notNull(),
  quarter: text("quarter").notNull(),
  month: integer("month").notNull(),
  day: integer("day").notNull(),
});

export const dimRegion = sqliteTable("dim_region", {
  regionId: text("region_id").primaryKey(),
  province: text("province").notNull(),
  regionName: text("region_name").notNull(),
  country: text("country").notNull(),
});

export const dimCustomer = sqliteTable("dim_customer", {
  customerId: text("customer_id").primaryKey(),
  customerName: text("customer_name").notNull(),
  gender: text("gender").notNull(),
  memberLevel: text("member_level").notNull(),
});

export const dimProduct = sqliteTable("dim_product", {
  productId: text("product_id").primaryKey(),
  productName: text("product_name").notNull(),
  category: text("category").notNull(),
  brand: text("brand").notNull(),
});

export const factOrder = sqliteTable(
  "fact_order",
  {
    orderId: text("order_id").primaryKey(),
    customerId: text("customer_id").notNull(),
    productId: text("product_id").notNull(),
    dateId: integer("date_id").notNull(),
    regionId: text("region_id").notNull(),
    orderQuantity: integer("order_quantity").notNull(),
    orderAmount: real("order_amount").notNull(),
  },
  (table) => [
    index("idx_fact_order_date").on(table.dateId),
    index("idx_fact_order_region").on(table.regionId),
    index("idx_fact_order_product").on(table.productId),
    index("idx_fact_order_customer").on(table.customerId),
  ],
);

export const tableInfo = sqliteTable("table_info", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
});

export const columnInfo = sqliteTable(
  "column_info",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    role: text("role").notNull(),
    examples: text("examples").notNull().default("[]"),
    description: text("description").notNull(),
    alias: text("alias").notNull().default("[]"),
    tableId: text("table_id").notNull(),
  },
  (table) => [index("idx_column_info_table").on(table.tableId)],
);

export const metricInfo = sqliteTable("metric_info", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  relevantColumns: text("relevant_columns").notNull().default("[]"),
  alias: text("alias").notNull().default("[]"),
});

export const columnMetric = sqliteTable("column_metric", {
  columnId: text("column_id").notNull(),
  metricId: text("metric_id").notNull(),
});

export const queryHistory = sqliteTable(
  "query_history",
  {
    id: text("id").primaryKey(),
    sessionKey: text("session_key").notNull().default("public"),
    question: text("question").notNull(),
    sql: text("sql").notNull(),
    rowCount: integer("row_count").notNull().default(0),
    elapsedMs: integer("elapsed_ms").notNull().default(0),
    status: text("status").notNull().default("success"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_query_history_created").on(table.createdAt)],
);