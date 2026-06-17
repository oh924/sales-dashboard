"use client";

import { useRouter, usePathname } from "next/navigation";

interface Report {
  id: string;
  year: number;
  month: number;
}

interface ReportSelectorProps {
  reports: Report[];
  currentId?: string;
}

export default function ReportSelector({ reports, currentId }: ReportSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (reports.length === 0) return null;

  return (
    <select
      value={currentId ?? ""}
      onChange={(e) => router.push(`${pathname}?reportId=${e.target.value}`)}
      className="border rounded px-2 py-1 text-sm bg-white"
    >
      {reports.map((r) => (
        <option key={r.id} value={r.id}>
          {r.year}年{r.month}月
        </option>
      ))}
    </select>
  );
}
