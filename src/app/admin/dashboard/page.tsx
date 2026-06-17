export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import KpiCards from "@/components/KpiCards";
import SalesTable from "@/components/SalesTable";
import ReportSelector from "@/components/ReportSelector";
import type { SalesDataRow } from "@/types";

interface Props {
  searchParams: Promise<{ reportId?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  const { reportId } = await searchParams;

  const reports = await prisma.salesReport.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  let currentReport = reports.find((r) => r.id === reportId) ?? reports[0] ?? null;

  let data: SalesDataRow[] = [];
  if (currentReport) {
    data = await prisma.salesData.findMany({
      where: { reportId: currentReport.id },
      orderBy: { rowOrder: "asc" },
    }) as unknown as SalesDataRow[];
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {currentReport
            ? `${currentReport.year}年${currentReport.month}月 受注速報`
            : "受注速報ダッシュボード"}
        </h1>
        <ReportSelector reports={reports.map((r) => ({ id: r.id, year: r.year, month: r.month }))} currentId={currentReport?.id} />
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>まだデータがありません。</p>
          <p className="text-sm mt-1">「インポート」メニューから Excel ファイルをアップロードしてください。</p>
        </div>
      ) : (
        <>
          <KpiCards data={data} />
          <AdminChartSection data={data} />
          <SalesTable data={data} />
        </>
      )}
    </div>
  );
}

// Lazy-import chart client component
async function AdminChartSection({ data }: { data: SalesDataRow[] }) {
  const { MonthlyCompareChart } = await import("@/components/SalesChart");
  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="text-sm font-semibold mb-3 text-gray-700">担当者別 受注・粗利（万円）</h2>
      <MonthlyCompareChart data={data} />
    </div>
  );
}
