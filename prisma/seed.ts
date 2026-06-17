import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: "管理者",
        email: "admin@example.com",
        passwordHash: await bcrypt.hash("admin1234", 12),
        role: "ADMIN",
      },
    });
    console.log("Admin user created: admin@example.com / admin1234");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
