"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NavBar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
          <span className="font-semibold text-gray-800">売上速報ダッシュボード</span>
        </Link>
        {isAdmin && (
          <div className="flex gap-2">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">ダッシュボード</Button>
            </Link>
            <Link href="/admin/upload">
              <Button variant="ghost" size="sm">インポート</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">ユーザー管理</Button>
            </Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{session?.user?.name}</span>
        <Badge variant={isAdmin ? "default" : "secondary"}>
          {isAdmin ? "管理者" : "ユーザー"}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          ログアウト
        </Button>
      </div>
    </nav>
  );
}
