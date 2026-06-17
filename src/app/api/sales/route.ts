import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId");

  let report;
  if (reportId) {
    report = await prisma.salesReport.findUnique({ where: { id: reportId } });
  } else {
    report = await prisma.salesReport.findFirst({
      where: { isActive: true },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  }

  if (!report) {
    return NextResponse.json({ report: null, data: [] });
  }

  const whereClause =
    session.user.role === "ADMIN"
      ? { reportId: report.id }
      : { reportId: report.id, salesRepName: session.user.salesRepName ?? "__none__" };

  const data = await prisma.salesData.findMany({
    where: whereClause,
    orderBy: { rowOrder: "asc" },
  });

  return NextResponse.json({ report, data });
}
