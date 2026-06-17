export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatRate, formatMonth } from "@/lib/utils/format";
import type { SalesDataRow } from "@/types";

export default async function UserDashboardPage() {
  const session = await auth();
  const salesRepName = session?.user?.salesRepName;

  if (!salesRepName) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">担当者が設定されていません。</p>
        <p className="text-sm text-gray-500 mt-1">管理者にお問い合わせください。</p>
      </div>
    );
  }

  const report = await prisma.salesReport.findFirst({
    where: { isActive: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  if (!report) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">まだデータがありません。</p>
      </div>
    );
  }

  const row = await prisma.salesData.findFirst({
    where: { reportId: report.id, salesRepName },
  }) as unknown as SalesDataRow | null;

  if (!row) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          {formatMonth(report.year, report.month)} のデータが見つかりませんでした。
        </p>
      </div>
    );
  }

  const achieveRate =
    row.h1Target && row.h1Target > 0
      ? Math.min(((row.h1CumulativeProfit ?? 0) / row.h1Target) * 100, 100)
      : 0;

  const kpis = [
    { label: "当月受注", value: `¥${formatCurrency(row.monthlyOrders)}` },
    { label: "当月粗利", value: `¥${formatCurrency(row.monthlyProfit)}` },
    { label: "粗利率", value: formatRate(row.monthlyRate) },
    { label: "純利益", value: `¥${formatCurrency(row.netProfit)}` },
    { label: "上期累計粗利", value: `¥${formatCurrency(row.h1CumulativeProfit)}` },
    { label: "上期粗利目標", value: `¥${formatCurrency(row.h1Target)}` },
  ];

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold">
        {salesRepName} さんの {formatMonth(report.year, report.month)} 実績
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-gray-500 font-normal">{k.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-xl font-bold">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {row.h1Target && row.h1Target > 0 && (
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">上期粗利目標 達成率</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-1">
            <Progress value={achieveRate} className="h-3" />
            <p className="text-sm text-gray-600">
              {achieveRate.toFixed(1)}% ({formatCurrency(row.h1CumulativeProfit)} / {formatCurrency(row.h1Target)} 円)
            </p>
          </CardContent>
        </Card>
      )}

      <UserChartSection row={row} />

      <WeeklyDetailTable row={row} />
    </div>
  );
}

async function UserChartSection({ row }: { row: SalesDataRow }) {
  const { WeeklyTrendChart } = await import("@/components/SalesChart");
  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="text-sm font-semibold mb-3 text-gray-700">週次 受注・粗利（万円）</h2>
      <WeeklyTrendChart row={row} />
    </div>
  );
}

function WeeklyDetailTable({ row }: { row: SalesDataRow }) {
  const weeks = [
    { label: "1週", orders: row.w1Orders, profit: row.w1Profit, rate: row.w1Rate },
    { label: "2週", orders: row.w2Orders, profit: row.w2Profit, rate: row.w2Rate },
    { label: "3週", orders: row.w3Orders, profit: row.w3Profit, rate: row.w3Rate },
    { label: "4週", orders: row.w4Orders, profit: row.w4Profit, rate: row.w4Rate },
    { label: "5週", orders: row.w5Orders, profit: row.w5Profit, rate: row.w5Rate },
  ];

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">週</th>
            <th className="px-4 py-2 text-right text-gray-600">受注</th>
            <th className="px-4 py-2 text-right text-gray-600">粗利</th>
            <th className="px-4 py-2 text-right text-gray-600">粗利率</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((w) => (
            <tr key={w.label} className="border-t">
              <td className="px-4 py-2 font-medium">{w.label}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(w.orders)}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(w.profit)}</td>
              <td className="px-4 py-2 text-right text-green-700">{formatRate(w.rate)}</td>
            </tr>
          ))}
          <tr className="border-t bg-blue-50 font-semibold">
            <td className="px-4 py-2">当月合計</td>
            <td className="px-4 py-2 text-right">{formatCurrency(row.monthlyOrders)}</td>
            <td className="px-4 py-2 text-right">{formatCurrency(row.monthlyProfit)}</td>
            <td className="px-4 py-2 text-right text-green-700">{formatRate(row.monthlyRate)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
