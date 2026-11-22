import type { QueryPayload } from "../lib/api-types";

export type ViewKey = "workbench" | "catalog" | "metrics" | "history";
export type Stage = { label: string; status: "running" | "success" | "error" };
export type QueryEntry = {
  id: string;
  question: string;
  status: "running" | "success" | "error";
  stages: Stage[];
  result?: QueryPayload;
  error?: string;
};

export const NAV_ITEMS = [
  { key: "workbench" as const, label: "问数工作台", icon: "dashboard" },
  { key: "catalog" as const, label: "数据地图", icon: "database" },
  { key: "metrics" as const, label: "指标中心", icon: "gauge" },
  { key: "history" as const, label: "查询历史", icon: "history" },
];