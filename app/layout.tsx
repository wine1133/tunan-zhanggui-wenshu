import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "掌柜问数 · 智能数据问答",
  description: "用自然语言查询数据仓库，自动召回元数据、生成 SQL、执行查询并可视化分析结果。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}