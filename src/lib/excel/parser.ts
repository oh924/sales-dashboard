import * as XLSX from "xlsx";
import type { ParsedExcel, SalesDataRow } from "@/types";

const SKIP_KEYWORDS = ["合計", "計", "総計", "小計", "総合"];
const SUMMARY_KEYWORDS = ["合計", "累計"];

function isSummaryRow(name: string): boolean {
  return SKIP_KEYWORDS.some((k) => name.includes(k)) || name.trim() === "";
}

function toNum(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[,¥%]/g, "").trim();
    const n = parseFloat(cleaned);
    return isNaN(n) ? null : n;
  }
  return null;
}

function findColumnIndexByKeywords(
  rows: string[][],
  ...keywords: string[]
): number {
  for (const row of rows) {
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] ?? "");
      if (keywords.every((k) => cell.includes(k))) return c;
    }
  }
  return -1;
}

interface ColumnMap {
  salesRep: number;
  weeks: Array<{ orders: number; profit: number; rate: number }>;
  monthlyOrders: number;
  monthlyProfit: number;
  monthlyRate: number;
  cumulativeOrders: number;
  cumulativeProfit: number;
  expenses: number;
  netProfit: number;
  h1CumulativeProfit: number;
  h1Target: number;
  h2CumulativeProfit: number;
  h2Target: number;
}

function buildColumnMap(headerRows: string[][]): ColumnMap {
  const flatHeaders = headerRows.map((row) =>
    row.map((c) => String(c ?? ""))
  );

  // Find 担当 column
  let salesRep = -1;
  for (const row of flatHeaders) {
    const idx = row.findIndex(
      (c) => c.includes("担当") || c.includes("氏名") || c.includes("名前")
    );
    if (idx !== -1) {
      salesRep = idx;
      break;
    }
  }
  if (salesRep === -1) salesRep = 0;

  // Build a merged header per column by concatenating all header row values
  const colCount = Math.max(...flatHeaders.map((r) => r.length));
  const mergedHeaders: string[] = Array(colCount).fill("");
  for (let c = 0; c < colCount; c++) {
    mergedHeaders[c] = flatHeaders
      .map((row) => row[c] ?? "")
      .filter(Boolean)
      .join("|");
  }

  // Find weekly columns: look for patterns like "1週|受注", "2週|粗利", etc.
  const weeks: ColumnMap["weeks"] = [];
  for (let w = 1; w <= 5; w++) {
    const weekLabel = `${w}週`;
    const orders = mergedHeaders.findIndex(
      (h) => h.includes(weekLabel) && h.includes("受注") && !h.includes("粗利")
    );
    const profit = mergedHeaders.findIndex(
      (h) => h.includes(weekLabel) && h.includes("粗利")
    );
    const rate = mergedHeaders.findIndex(
      (h) =>
        h.includes(weekLabel) &&
        (h.includes("率") || h.includes("粗利率")) &&
        !h.includes("受注") &&
        !h.includes("粗利|")
    );
    // Fallback: consecutive columns after orders
    weeks.push({
      orders: orders !== -1 ? orders : -1,
      profit: profit !== -1 ? profit : orders !== -1 ? orders + 1 : -1,
      rate: rate !== -1 ? rate : orders !== -1 ? orders + 2 : -1,
    });
  }

  const monthlyOrders = mergedHeaders.findIndex(
    (h) =>
      h.includes("当月") &&
      h.includes("受注") &&
      !h.includes("粗利") &&
      !h.includes("率")
  );
  const monthlyProfit = mergedHeaders.findIndex(
    (h) => h.includes("当月") && h.includes("粗利") && !h.includes("率")
  );
  const monthlyRate = mergedHeaders.findIndex(
    (h) =>
      h.includes("当月") &&
      (h.includes("粗利率") || (h.includes("粗利") && h.includes("率")))
  );

  const cumulativeOrders = mergedHeaders.findIndex(
    (h) => h.includes("総合計") && h.includes("受注")
  );
  const cumulativeProfit = mergedHeaders.findIndex(
    (h) => h.includes("総合計") && h.includes("粗利") && !h.includes("率")
  );
  const expenses = mergedHeaders.findIndex((h) => h.includes("経費"));
  const netProfit = mergedHeaders.findIndex((h) => h.includes("純利益"));

  const h1CumulativeProfit = mergedHeaders.findIndex(
    (h) => h.includes("上期") && h.includes("累計") && h.includes("粗利")
  );
  const h1Target = mergedHeaders.findIndex(
    (h) => h.includes("上期") && (h.includes("目標") || h.includes("粗利目標"))
  );
  const h2CumulativeProfit = mergedHeaders.findIndex(
    (h) => h.includes("下期") && h.includes("累計")
  );
  const h2Target = mergedHeaders.findIndex(
    (h) => h.includes("下期") && h.includes("目標")
  );

  return {
    salesRep,
    weeks,
    monthlyOrders,
    monthlyProfit,
    monthlyRate,
    cumulativeOrders,
    cumulativeProfit,
    expenses,
    netProfit,
    h1CumulativeProfit,
    h1Target,
    h2CumulativeProfit,
    h2Target,
  };
}

export function parseExcel(buffer: Buffer): ParsedExcel {
  const workbook = XLSX.read(buffer, { type: "buffer", cellText: false, cellNF: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Extract year/month from sheet name (e.g. "2026.4月確定")
  const yearMonthMatch = sheetName.match(/(\d{4})[.\-年](\d{1,2})月?/);
  const year = yearMonthMatch ? parseInt(yearMonthMatch[1]) : new Date().getFullYear();
  const month = yearMonthMatch ? parseInt(yearMonthMatch[2]) : new Date().getMonth() + 1;

  // Convert sheet to array of arrays
  const raw: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: true,
  });

  // Find where data rows start (after header rows)
  // Typically: row 0 = title, rows 1-3 = headers, row 4+ = data
  // But detect dynamically: find first row where col 0 looks like a person's name
  const HEADER_ROWS_COUNT = 4;
  const headerRows = raw.slice(0, HEADER_ROWS_COUNT).map((r) =>
    (r as unknown[]).map((c) => String(c ?? ""))
  );

  const colMap = buildColumnMap(headerRows);

  const dataRows = raw.slice(HEADER_ROWS_COUNT);
  const rows: Omit<SalesDataRow, "id">[] = [];

  dataRows.forEach((row, idx) => {
    const arr = row as unknown[];
    const salesRepName = String(arr[colMap.salesRep] ?? "").trim();
    if (!salesRepName || isSummaryRow(salesRepName)) return;

    const g = (c: number) => (c >= 0 ? toNum(arr[c]) : null);

    rows.push({
      salesRepName,
      rowOrder: idx,
      w1Orders: g(colMap.weeks[0]?.orders),
      w1Profit: g(colMap.weeks[0]?.profit),
      w1Rate: g(colMap.weeks[0]?.rate),
      w2Orders: g(colMap.weeks[1]?.orders),
      w2Profit: g(colMap.weeks[1]?.profit),
      w2Rate: g(colMap.weeks[1]?.rate),
      w3Orders: g(colMap.weeks[2]?.orders),
      w3Profit: g(colMap.weeks[2]?.profit),
      w3Rate: g(colMap.weeks[2]?.rate),
      w4Orders: g(colMap.weeks[3]?.orders),
      w4Profit: g(colMap.weeks[3]?.profit),
      w4Rate: g(colMap.weeks[3]?.rate),
      w5Orders: g(colMap.weeks[4]?.orders),
      w5Profit: g(colMap.weeks[4]?.profit),
      w5Rate: g(colMap.weeks[4]?.rate),
      monthlyOrders: g(colMap.monthlyOrders),
      monthlyProfit: g(colMap.monthlyProfit),
      monthlyRate: g(colMap.monthlyRate),
      cumulativeOrders: g(colMap.cumulativeOrders),
      cumulativeProfit: g(colMap.cumulativeProfit),
      expenses: g(colMap.expenses),
      netProfit: g(colMap.netProfit),
      h1CumulativeProfit: g(colMap.h1CumulativeProfit),
      h1Target: g(colMap.h1Target),
      h2CumulativeProfit: g(colMap.h2CumulativeProfit),
      h2Target: g(colMap.h2Target),
    });
  });

  // Title from row 0
  const titleRow = raw[0] as unknown[];
  const title = titleRow.map((c) => String(c ?? "")).filter(Boolean).join(" ").trim() || `${year}年${month}月 受注速報`;

  return {
    meta: { year, month, title, sheetName },
    rows,
  };
}
