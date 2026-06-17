"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserData {
  id?: string;
  name: string;
  email: string;
  role: string;
  salesRepName: string;
}

interface UserFormProps {
  mode: "create" | "edit";
  initial?: UserData;
  salesRepNames?: string[];
  onSuccess: () => void;
}

export default function UserForm({ mode, initial, salesRepNames = [], onSuccess }: UserFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initial?.role ?? "USER");
  const [salesRepName, setSalesRepName] = useState(initial?.salesRepName ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = mode === "create" ? "/api/users" : `/api/users/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const body: Record<string, string> = { name, email, role, salesRepName };
    if (password) body.password = password;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "エラーが発生しました");
    } else {
      setOpen(false);
      onSuccess();
    }
  }

  function handleOpen(v: boolean) {
    setOpen(v);
    if (v && mode === "create") {
      setName(""); setEmail(""); setPassword(""); setRole("USER"); setSalesRepName("");
    }
    setError("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 h-8 px-3 ${mode === "create" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"}`}
      >
        {mode === "create" ? "新規ユーザー追加" : "編集"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "ユーザー追加" : "ユーザー編集"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>名前</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>メールアドレス</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>{mode === "create" ? "パスワード" : "パスワード（変更する場合のみ）"}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === "create"}
              minLength={8}
            />
          </div>
          <div>
            <Label>ロール</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="USER">一般ユーザー</option>
              <option value="ADMIN">管理者</option>
            </select>
          </div>
          <div>
            <Label>担当名（Excel の担当列と一致させてください）</Label>
            {salesRepNames.length > 0 ? (
              <select
                value={salesRepName}
                onChange={(e) => setSalesRepName(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">-- 未設定 --</option>
                {salesRepNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <Input
                value={salesRepName}
                onChange={(e) => setSalesRepName(e.target.value)}
                placeholder="例: 山田"
              />
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "保存中..." : "保存"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
