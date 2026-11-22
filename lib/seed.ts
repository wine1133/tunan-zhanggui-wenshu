const REGIONS = [
  { id: "R01", province: "北京", name: "华北", country: "中国" },
  { id: "R02", province: "上海", name: "华东", country: "中国" },
  { id: "R03", province: "广东", name: "华南", country: "中国" },
  { id: "R04", province: "湖北", name: "华中", country: "中国" },
  { id: "R05", province: "四川", name: "西南", country: "中国" },
] as const;

const CUSTOMERS = [
  ["C01", "林晓岚", "女", "铂金会员"],
  ["C02", "周予安", "男", "黄金会员"],
  ["C03", "陈知夏", "女", "普通会员"],
  ["C04", "许承泽", "男", "钻石会员"],
  ["C05", "沈星禾", "女", "黄金会员"],
  ["C06", "顾言川", "男", "铂金会员"],
  ["C07", "苏念", "女", "普通会员"],
  ["C08", "陆景明", "男", "黄金会员"],
  ["C09", "程若溪", "女", "钻石会员"],
  ["C10", "宋屿", "男", "普通会员"],
  ["C11", "叶清和", "女", "铂金会员"],
  ["C12", "江远", "男", "黄金会员"],
  ["C13", "唐微澜", "女", "普通会员"],
  ["C14", "秦朗", "男", "钻石会员"],
  ["C15", "温以宁", "女", "黄金会员"],
  ["C16", "韩川", "男", "铂金会员"],
] as const;

const PRODUCTS = [
  ["P01", "星环智能手表", "数码", "星辰", 1299],
  ["P02", "云雀无线耳机", "数码", "云启", 699],
  ["P03", "极光便携音箱", "数码", "极光", 399],
  ["P04", "守望智能门锁", "智能家居", "远山", 1599],
  ["P05", "青禾扫地机器人", "智能家居", "青禾", 2399],
  ["P06", "森呼吸空气净化器", "智能家居", "青禾", 1899],
  ["P07", "山海平板电脑", "办公", "星辰", 3299],
  ["P08", "墨影机械键盘", "办公", "远山", 549],
  ["P09", "薄雾移动电源", "数码", "云启", 199],
  ["P10", "明眸智能摄像头", "智能家居", "极光", 499],
] as const;

const TABLE_ROWS = [
  ["T01", "dim_date", "dim", "日期维度表，按天记录年份、季度、月份与日期，用于时间筛选和趋势分析。"],
  ["T02", "dim_region", "dim", "地区维度表，记录省份、区域名称与国家，用于地区分组和筛选。"],
  ["T03", "dim_customer", "dim", "客户维度表，记录客户姓名、性别与会员等级，用于客户结构分析。"],
  ["T04", "dim_product", "dim", "商品维度表，记录商品名称、品类与品牌，用于商品销售分析。"],
  ["T05", "fact_order", "fact", "订单事实表，存储订单数量与订单金额，是销售分析的核心度量表。"],
] as const;

const COLUMN_ROWS = [
  ["DC01", "date_id", "INT", "primary_key", "[\"20250101\",\"20251231\"]", "日期 ID，格式为 YYYYMMDD。", "[\"日期编号\"]", "T01"],
  ["DC02", "year", "INT", "dimension", "[\"2024\",\"2025\"]", "订单所属年份。", "[\"年\",\"年份\"]", "T01"],
  ["DC03", "quarter", "VARCHAR", "dimension", "[\"Q1\",\"Q2\",\"Q3\",\"Q4\"]", "订单所属季度。", "[\"季度\"]", "T01"],
  ["DC04", "month", "INT", "dimension", "[\"1\",\"6\",\"12\"]", "订单所属月份。", "[\"月\",\"月份\"]", "T01"],
  ["DR01", "region_id", "VARCHAR", "primary_key", "[\"R01\",\"R02\"]", "地区唯一编号。", "[\"区域编号\"]", "T02"],
  ["DR02", "region_name", "VARCHAR", "dimension", "[\"华北\",\"华东\",\"华南\"]", "业务分析使用的大区名称。", "[\"地区\",\"区域\",\"大区\"]", "T02"],
  ["DR03", "province", "VARCHAR", "dimension", "[\"北京\",\"上海\",\"广东\"]", "地区对应省份。", "[\"省份\"]", "T02"],
  ["DR04", "country", "VARCHAR", "dimension", "[\"中国\"]", "地区所属国家。", "[\"国家\"]", "T02"],
  ["DP01", "product_id", "VARCHAR", "primary_key", "[\"P01\",\"P02\"]", "商品唯一编号。", "[\"商品编号\"]", "T04"],
  ["DP02", "product_name", "VARCHAR", "dimension", "[\"星环智能手表\",\"云雀无线耳机\"]", "商品展示名称。", "[\"商品\",\"产品\"]", "T04"],
  ["DP03", "category", "VARCHAR", "dimension", "[\"数码\",\"智能家居\",\"办公\"]", "商品所属品类。", "[\"品类\",\"类别\"]", "T04"],
  ["DP04", "brand", "VARCHAR", "dimension", "[\"星辰\",\"云启\",\"极光\"]", "商品所属品牌。", "[\"品牌\"]", "T04"],
  ["DCU1", "customer_id", "VARCHAR", "primary_key", "[\"C01\",\"C02\"]", "客户唯一编号。", "[\"客户编号\"]", "T03"],
  ["DCU2", "customer_name", "VARCHAR", "dimension", "[\"林晓岚\",\"周予安\"]", "客户姓名。", "[\"客户\",\"用户\"]", "T03"],
  ["DCU3", "gender", "VARCHAR", "dimension", "[\"男\",\"女\"]", "客户性别。", "[\"性别\"]", "T03"],
  ["DCU4", "member_level", "VARCHAR", "dimension", "[\"普通会员\",\"黄金会员\",\"铂金会员\",\"钻石会员\"]", "客户会员等级。", "[\"会员等级\",\"等级\"]", "T03"],
  ["FO01", "order_id", "VARCHAR", "primary_key", "[\"ORD-20250101-1\"]", "订单唯一编号。", "[\"订单编号\"]", "T05"],
  ["FO02", "order_quantity", "INT", "measure", "[\"1\",\"2\",\"3\"]", "订单购买件数，可用于统计销量。", "[\"销量\",\"件数\",\"数量\"]", "T05"],
  ["FO03", "order_amount", "FLOAT", "measure", "[\"1299.0\",\"2398.0\"]", "订单成交金额，可用于统计销售额。", "[\"销售额\",\"金额\",\"营收\",\"GMV\"]", "T05"],
  ["FO04", "customer_id", "VARCHAR", "foreign_key", "[\"C01\",\"C02\"]", "订单关联客户。", "[\"客户\"]", "T05"],
  ["FO05", "product_id", "VARCHAR", "foreign_key", "[\"P01\",\"P02\"]", "订单关联商品。", "[\"商品\"]", "T05"],
  ["FO06", "date_id", "INT", "foreign_key", "[\"20250101\"]", "订单关联日期。", "[\"日期\"]", "T05"],
  ["FO07", "region_id", "VARCHAR", "foreign_key", "[\"R01\",\"R02\"]", "订单关联地区。", "[\"地区\"]", "T05"],
] as const;

const METRIC_ROWS = [
  ["M01", "销售总额", "订单金额的汇总，统计口径为 SUM(fact_order.order_amount)。", "[\"fact_order.order_amount\"]", "[\"销售额\",\"营收\",\"GMV\",\"成交额\"]"],
  ["M02", "销量", "订单商品件数的汇总，统计口径为 SUM(fact_order.order_quantity)。", "[\"fact_order.order_quantity\"]", "[\"销量\",\"件数\",\"销售数量\"]"],
  ["M03", "订单数", "订单记录数，统计口径为 COUNT(fact_order.order_id)。", "[\"fact_order.order_id\"]", "[\"单量\",\"笔数\"]"],
  ["M04", "客单价", "销售总额除以订单数，反映平均每笔订单的成交金额。", "[\"fact_order.order_amount\",\"fact_order.order_id\"]", "[\"平均订单金额\",\"AOV\"]"],
] as const;

const COLUMN_METRICS = [
  ["FO03", "M01"],
  ["FO02", "M02"],
  ["FO01", "M03"],
  ["FO03", "M04"],
  ["FO01", "M04"],
] as const;

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function quote(value: string | number) {
  if (typeof value === "number") return value;
  return value.replaceAll("'", "''");
}

export async function ensureWarehouseSeed(db: D1Database) {
  const row = await db
    .prepare("SELECT COUNT(*) AS count FROM fact_order")
    .first<{ count: number }>();

  if ((row?.count ?? 0) > 0) {
    return { seeded: false };
  }

  const random = createRandom(20261122);
  const statements: D1PreparedStatement[] = [];

  for (let year = 2024; year <= 2025; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
      for (let day = 1; day <= days; day += 1) {
        const dateId = year * 10000 + month * 100 + day;
        const quarter = `Q${Math.floor((month - 1) / 3) + 1}`;
        statements.push(
          db
            .prepare(
              "INSERT OR IGNORE INTO dim_date (date_id, year, quarter, month, day) VALUES (?, ?, ?, ?, ?)",
            )
            .bind(dateId, year, quarter, month, day),
        );
      }
    }
  }

  for (const region of REGIONS) {
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO dim_region (region_id, province, region_name, country) VALUES (?, ?, ?, ?)",
        )
        .bind(region.id, region.province, region.name, region.country),
    );
  }

  for (const [id, name, gender, level] of CUSTOMERS) {
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO dim_customer (customer_id, customer_name, gender, member_level) VALUES (?, ?, ?, ?)",
        )
        .bind(id, name, gender, level),
    );
  }

  for (const [id, name, category, brand, price] of PRODUCTS) {
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO dim_product (product_id, product_name, category, brand) VALUES (?, ?, ?, ?)",
        )
        .bind(id, name, category, brand),
    );
    void price;
  }

  let sequence = 0;
  for (let year = 2024; year <= 2025; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
      for (let day = 1; day <= days; day += 1) {
        const dateId = year * 10000 + month * 100 + day;
        const dayIndex = Math.floor(
          (Date.UTC(year, month - 1, day) - Date.UTC(2024, 0, 1)) /
            86400000,
        );

        for (let regionIndex = 0; regionIndex < REGIONS.length; regionIndex += 1) {
          sequence += 1;
          const productIndex = (dayIndex * 7 + regionIndex * 3) % PRODUCTS.length;
          const customerIndex = (dayIndex * 5 + regionIndex * 2) % CUSTOMERS.length;
          const product = PRODUCTS[productIndex];
          const customer = CUSTOMERS[customerIndex];
          const region = REGIONS[regionIndex];
          const quantity = 1 + ((dayIndex + regionIndex * 2) % 4);
          const multiplier = 0.88 + random() * 0.14;
          const amount = Math.round(quantity * product[4] * multiplier * 100) / 100;
          const orderId = `ORD-${dateId}-${regionIndex + 1}`;

          statements.push(
            db
              .prepare(
                "INSERT OR IGNORE INTO fact_order (order_id, customer_id, product_id, date_id, region_id, order_quantity, order_amount) VALUES (?, ?, ?, ?, ?, ?, ?)",
              )
              .bind(
                orderId,
                customer[0],
                product[0],
                dateId,
                region.id,
                quantity,
                amount,
              ),
          );
          void sequence;
        }
      }
    }
  }

  for (const [id, name, role, description] of TABLE_ROWS) {
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO table_info (id, name, role, description) VALUES (?, ?, ?, ?)",
        )
        .bind(id, name, role, description),
    );
  }

  for (const row of COLUMN_ROWS) {
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO column_info (id, name, type, role, examples, description, alias, table_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(...row),
    );
  }

  for (const [id, name, description, relevantColumns, alias] of METRIC_ROWS) {
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO metric_info (id, name, description, relevant_columns, alias) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(id, name, description, relevantColumns, alias),
    );
  }

  for (const [columnId, metricId] of COLUMN_METRICS) {
    statements.push(
      db
        .prepare(
          "INSERT OR IGNORE INTO column_metric (column_id, metric_id) VALUES (?, ?)",
        )
        .bind(columnId, metricId),
    );
  }

  for (let offset = 0; offset < statements.length; offset += 60) {
    await db.batch(statements.slice(offset, offset + 60));
  }

  return { seeded: true, rows: statements.length };
}

export { REGIONS, PRODUCTS, CUSTOMERS };
void quote;