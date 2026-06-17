import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  // Prisma Postgres (prisma+postgres://) needs the Accelerate extension
  if (process.env.DATABASE_URL?.startsWith("prisma+postgres://")) {
    return client.$extends(withAccelerate()) as unknown as PrismaClient;
  }
  return client;
}

export const prisma = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
