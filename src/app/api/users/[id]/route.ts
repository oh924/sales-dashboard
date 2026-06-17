import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, email, password, role, salesRepName } = await req.json();

  const updateData: Record<string, unknown> = {
    name,
    email,
    role: role === "ADMIN" ? "ADMIN" : "USER",
    salesRepName: salesRepName || null,
  };
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 12);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, salesRepName: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ error: "自分自身は削除できません" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }
}
