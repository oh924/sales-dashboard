import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatRate } from "@/lib/utils/format";
import type { SalesDataRow } from "@/types";

interface KpiCardsProps {
  data: SalesDataRow[];
  title?: string;
}

export default function KpiCards({ data, title }: KpiCardsProps) {
  const totalOrders = data.reduce((s, r) => s + (r.monthlyOrders ?? 0), 0);
  const totalProfit = data.reduce((s, r) => s + (r.monthlyProfit ?? 0), 0);
  const totalNetProfit = data.reduce((s, r) => s + (r.netProfit ?? 0), 0);
  const totalH1Target = data.reduce((s, r) => s + (r.h1Target ?? 0), 0);
  const totalH1Profit = data.reduce((s, r) => s + (r.h1CumulativeProfit ?? 0), 0);
  const avgRate = totalOrders > 0 ? (totalProfit / totalOrders) * 100 : 0;
  const targetAchieve = totalH1Target > 0 ? (totalH1Profit / totalH1Target) * 100 : 0;

  const cards = [
    { label: "当月受注合計", value: `¥${formatCurrency(totalOrders)}` },
    { label: "当月粗利合計", value: `¥${formatCurrency(totalProfit)}` },
    { label: "平均粗利率", value: `${avgRate.toFixed(1)}%` },
    { label: "純利益合計", value: `¥${formatCurrency(totalNetProfit)}` },
    { label: "上期目標達成率", value: totalH1Target > 0 ? `${targetAchieve.toFixed(1)}%` : "-" },
  ];

  return (
    <div className="space-y-2">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs text-gray-500 font-normal">{c.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-lg font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
