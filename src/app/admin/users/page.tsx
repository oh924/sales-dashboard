export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, salesRepName: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Get available sales rep names from latest report
  const latestReport = await prisma.salesReport.findFirst({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  let salesRepNames: string[] = [];
  if (latestReport) {
    const repData = await prisma.salesData.findMany({
      where: { reportId: latestReport.id },
      select: { salesRepName: true },
      orderBy: { rowOrder: "asc" },
    });
    salesRepNames = repData.map((d) => d.salesRepName);
  }

  return <UsersClient initialUsers={users} salesRepNames={salesRepNames} />;
}
