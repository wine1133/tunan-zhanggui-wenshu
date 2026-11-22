# 兔南掌柜问数

> 详细项目说明：[docs/项目说明.md](docs/项目说明.md)

兔南掌柜问数是一个面向数据仓库场景的智能问数系统。用户直接用中文提问，系统完成元数据召回、只读 SQL 生成与校验、数据查询、结果表格和自动可视化。

公网演示：https://tunan-zhanggui-wenshu.builtbluebell8.chatgpt.site

GitHub：https://github.com/wine1133/tunan-zhanggui-wenshu

## 功能

- **自然语言问数**：支持地区、商品、品类、品牌、客户、会员等级、性别、月份和季度等分析维度。
- **元数据召回**：从表、字段、指标和别名中匹配问题所需的业务上下文。
- **安全 SQL**：只执行系统模板生成的只读查询，用户输入不会被直接拼接为 SQL。
- **SSE 流式进度**：前端实时展示「理解问题 → 召回元数据 → 生成 SQL → 执行查询」链路。
- **自动可视化**：根据问题返回指标卡、柱状图、折线图、结果表格和文字洞察。
- **数据资产视图**：内置数据地图、指标中心和查询历史。
- **真实数据库**：使用 Cloudflare D1 保存数仓样例数据、元数据和查询历史。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | Next.js / React 19 / Tailwind CSS 4 |
| 服务端 | Next Route Handlers / Vinext / Cloudflare Workers |
| 数据库 | Cloudflare D1 / SQLite |
| ORM 与迁移 | Drizzle ORM / Drizzle Kit |
| 部署 | ChatGPT Sites |

本项目按课程需求复现了核心 NL2SQL 闭环。为了得到一个无需额外运维即可长期访问的公网演示，课程中的 MySQL + Qdrant + Elasticsearch + TEI 组合在本版本中收敛为 D1 + 元数据检索 + 规则化语义解析；后续可以无缝接入真实大模型和向量索引。

## 数据模型

数仓样例采用订单星型模型：

- `fact_order`：订单事实表，包含订单数量与订单金额。
- `dim_date`：日期维度。
- `dim_region`：地区维度。
- `dim_product`：商品维度。
- `dim_customer`：客户维度。
- `table_info`、`column_info`、`metric_info`、`column_metric`：元数据知识库。
- `query_history`：查询历史。

首次访问概览或执行查询时，服务端会幂等写入 2024—2025 年的样例订单数据和元数据。

## 示例问题

```text
2025年各地区销售总额
2025年各个商品的销量
各地区销量排名前三的商品
按月份看2025年销售趋势
各会员等级的客单价
各品牌销售额排名
华北地区销售总额
```

## 本地运行

环境要求：Node.js 22.13+。

```powershell
npm install
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_lonely_cloak.sql
npm run dev
```

打开 `http://127.0.0.1:5173`。

也可以使用生产构建预览：

```powershell
npm start
```

打开 `http://127.0.0.1:8787`。

## API

- `GET /api/overview`：概览指标、月度趋势、地区排行、品类结构和最近查询。
- `GET /api/catalog`：表、字段、指标元数据。
- `POST /api/query`：接收 `{ "question": "..." }`，通过 SSE 返回执行阶段和查询结果。

## 安全边界

- 只允许 `SELECT` / `WITH` 查询。
- 禁止写操作和注释注入。
- 所有筛选值通过 D1 Prepared Statement 绑定。
- 查询问题长度限制为 300 字。
- 查询历史仅保留最近 200 条。

## 目录结构

```text
app/                   页面与 API 路由
components/            工作台、图表、数据地图和历史视图
db/                    Drizzle 表定义与 D1 客户端
drizzle/               SQL 迁移
lib/                   NL2SQL、元数据召回、种子数据与类型
public/                静态资源
worker/                Cloudflare Worker 入口
```

## 后续扩展

- 接入 OpenAI-compatible 大模型生成复杂 SQL。
- 使用 Qdrant 做字段与指标向量召回。
- 使用 Elasticsearch 做维度值全文召回。
- 增加鉴权、租户隔离和查询审计。
- 接入 MySQL / Hive / ClickHouse 等生产数据源。

## License

MIT