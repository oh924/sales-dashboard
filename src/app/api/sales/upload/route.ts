import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseExcel } from "@/lib/excel/parser";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.xlsx?$/i)) {
    return NextResponse.json(
      { error: "Excel ファイル (.xlsx) のみ対応しています" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let parsed;
  try {
    parsed = parseExcel(buffer);
  } catch (e) {
    console.error("Excel parse error:", e);
    return NextResponse.json(
      { error: "Excel ファイルの解析に失敗しました" },
      { status: 422 }
    );
  }

  const { meta, rows } = parsed;

  await prisma.$transaction(async (tx) => {
    // Upsert the report
    const existing = await tx.salesReport.findUnique({
      where: { year_month: { year: meta.year, month: meta.month } },
    });

    let reportId: string;
    if (existing) {
      await tx.salesData.deleteMany({ where: { reportId: existing.id } });
      await tx.salesReport.update({
        where: { id: existing.id },
        data: {
          title: meta.title,
          fileName: file.name,
          uploadedById: session.user.id,
          uploadedAt: new Date(),
          isActive: true,
        },
      });
      reportId = existing.id;
    } else {
      const report = await tx.salesReport.create({
        data: {
          year: meta.year,
          month: meta.month,
          title: meta.title,
          fileName: file.name,
          uploadedById: session.user.id,
          isActive: true,
        },
      });
      reportId = report.id;
    }

    if (rows.length > 0) {
      await tx.salesData.createMany({
        data: rows.map((r) => ({ ...r, reportId })),
      });
    }
  });

  return NextResponse.json({
    message: `${meta.year}年${meta.month}月のデータを取り込みました（${rows.length} 件）`,
    year: meta.year,
    month: meta.month,
    rowCount: rows.length,
  });
}
