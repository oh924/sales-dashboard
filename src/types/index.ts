export type Role = "ADMIN" | "USER";

export interface SalesDataRow {
  id: string;
  salesRepName: string;
  rowOrder: number;
  w1Orders: number | null;
  w1Profit: number | null;
  w1Rate: number | null;
  w2Orders: number | null;
  w2Profit: number | null;
  w2Rate: number | null;
  w3Orders: number | null;
  w3Profit: number | null;
  w3Rate: number | null;
  w4Orders: number | null;
  w4Profit: number | null;
  w4Rate: number | null;
  w5Orders: number | null;
  w5Profit: number | null;
  w5Rate: number | null;
  monthlyOrders: number | null;
  monthlyProfit: number | null;
  monthlyRate: number | null;
  cumulativeOrders: number | null;
  cumulativeProfit: number | null;
  expenses: number | null;
  netProfit: number | null;
  h1CumulativeProfit: number | null;
  h1Target: number | null;
  h2CumulativeProfit: number | null;
  h2Target: number | null;
}

export interface ReportMeta {
  year: number;
  month: number;
  title: string;
  sheetName: string;
}

export interface ParsedExcel {
  meta: ReportMeta;
  rows: Omit<SalesDataRow, "id">[];
}
