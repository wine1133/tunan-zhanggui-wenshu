import { env } from "cloudflare:workers";

export function getD1() {
  if (!env.DB) {
    throw new Error("D1 数据库尚未连接，请检查 Sites 的 DB 绑定。");
  }
  return env.DB;
}