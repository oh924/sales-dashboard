"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SalesDataRow } from "@/types";

interface SalesChartProps {
  data: SalesDataRow[];
  mode?: "monthly" | "weekly";
}

const COLORS = [
  "#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#84cc16","#f97316","#e11d48","#6366f1",
];

export function MonthlyCompareChart({ data }: { data: SalesDataRow[] }) {
  const chartData = data.map((d) => ({
    name: d.salesRepName,
    受注: Math.round((d.monthlyOrders ?? 0) / 10000),
    粗利: Math.round((d.monthlyProfit ?? 0) / 10000),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}万`} />
        <Tooltip formatter={(v) => `${v}万円`} />
        <Legend />
        <Bar dataKey="受注" fill="#3b82f6" />
        <Bar dataKey="粗利" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WeeklyTrendChart({ row }: { row: SalesDataRow }) {
  const weeks = [
    { week: "1週", orders: row.w1Orders, profit: row.w1Profit },
    { week: "2週", orders: row.w2Orders, profit: row.w2Profit },
    { week: "3週", orders: row.w3Orders, profit: row.w3Profit },
    { week: "4週", orders: row.w4Orders, profit: row.w4Profit },
    { week: "5週", orders: row.w5Orders, profit: row.w5Profit },
  ].filter((w) => w.orders !== null || w.profit !== null);

  const chartData = weeks.map((w) => ({
    name: w.week,
    受注: Math.round((w.orders ?? 0) / 10000),
    粗利: Math.round((w.profit ?? 0) / 10000),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}万`} />
        <Tooltip formatter={(v) => `${v}万円`} />
        <Legend />
        <Bar dataKey="受注" fill="#3b82f6" />
        <Bar dataKey="粗利" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
