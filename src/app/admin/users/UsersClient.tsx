"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/UserForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  salesRepName: string | null;
  createdAt: Date | string;
}

interface Props {
  initialUsers: User[];
  salesRepNames: string[];
}

export default function UsersClient({ initialUsers, salesRepNames }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`${name} を削除しますか？`)) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const json = await res.json();
      alert(json.error ?? "削除に失敗しました");
    }
  }

  function refresh() {
    router.refresh();
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers);
  }

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
        <UserForm mode="create" salesRepNames={salesRepNames} onSuccess={refresh} />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">名前</th>
              <th className="px-4 py-3 text-left">メールアドレス</th>
              <th className="px-4 py-3 text-left">ロール</th>
              <th className="px-4 py-3 text-left">担当名</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                    {u.role === "ADMIN" ? "管理者" : "一般"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {u.salesRepName ?? <span className="text-gray-400">未設定</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <UserForm
                      mode="edit"
                      initial={{ ...u, salesRepName: u.salesRepName ?? "" }}
                      salesRepNames={salesRepNames}
                      onSuccess={refresh}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(u.id, u.name)}
                    >
                      削除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
