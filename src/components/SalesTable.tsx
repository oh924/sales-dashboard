import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatRate } from "@/lib/utils/format";
import type { SalesDataRow } from "@/types";

interface SalesTableProps {
  data: SalesDataRow[];
}

const WEEK_LABELS = ["1週", "2週", "3週", "4週", "5週"];

export default function SalesTable({ data }: SalesTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        データがありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table className="text-xs min-w-[1200px]">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead rowSpan={2} className="border-r text-center align-middle min-w-[60px]">担当</TableHead>
            {WEEK_LABELS.map((w) => (
              <TableHead key={w} colSpan={3} className="border-r text-center">{w}</TableHead>
            ))}
            <TableHead colSpan={3} className="border-r text-center">当月合計</TableHead>
            <TableHead className="text-center border-r">純利益</TableHead>
            <TableHead className="text-center border-r">上期粗利目標</TableHead>
            <TableHead className="text-center">上期累計</TableHead>
          </TableRow>
          <TableRow className="bg-gray-50">
            {[...WEEK_LABELS, "当月"].map((w) => (
              <>
                <TableHead key={`${w}-ord`} className="text-right text-gray-500">受注</TableHead>
                <TableHead key={`${w}-prf`} className="text-right text-gray-500">粗利</TableHead>
                <TableHead key={`${w}-rat`} className="text-right text-gray-500 border-r">率</TableHead>
              </>
            ))}
            <TableHead className="text-right text-gray-500 border-r">純利益</TableHead>
            <TableHead className="text-right text-gray-500 border-r">目標</TableHead>
            <TableHead className="text-right text-gray-500">累計粗利</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className="hover:bg-blue-50">
              <TableCell className="font-medium border-r">{row.salesRepName}</TableCell>
              {/* Week 1 */}
              <TableCell className="text-right">{formatCurrency(row.w1Orders)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.w1Profit)}</TableCell>
              <TableCell className="text-right border-r text-green-700">{formatRate(row.w1Rate)}</TableCell>
              {/* Week 2 */}
              <TableCell className="text-right">{formatCurrency(row.w2Orders)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.w2Profit)}</TableCell>
              <TableCell className="text-right border-r text-green-700">{formatRate(row.w2Rate)}</TableCell>
              {/* Week 3 */}
              <TableCell className="text-right">{formatCurrency(row.w3Orders)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.w3Profit)}</TableCell>
              <TableCell className="text-right border-r text-green-700">{formatRate(row.w3Rate)}</TableCell>
              {/* Week 4 */}
              <TableCell className="text-right">{formatCurrency(row.w4Orders)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.w4Profit)}</TableCell>
              <TableCell className="text-right border-r text-green-700">{formatRate(row.w4Rate)}</TableCell>
              {/* Week 5 */}
              <TableCell className="text-right">{formatCurrency(row.w5Orders)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.w5Profit)}</TableCell>
              <TableCell className="text-right border-r text-green-700">{formatRate(row.w5Rate)}</TableCell>
              {/* Monthly */}
              <TableCell className="text-right font-semibold">{formatCurrency(row.monthlyOrders)}</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(row.monthlyProfit)}</TableCell>
              <TableCell className="text-right border-r text-green-700 font-semibold">{formatRate(row.monthlyRate)}</TableCell>
              {/* Net profit */}
              <TableCell className="text-right border-r font-semibold text-blue-700">{formatCurrency(row.netProfit)}</TableCell>
              {/* H1 target */}
              <TableCell className="text-right border-r">{formatCurrency(row.h1Target)}</TableCell>
              {/* H1 cumulative */}
              <TableCell className="text-right">{formatCurrency(row.h1CumulativeProfit)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
