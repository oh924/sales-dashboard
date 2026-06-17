"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadResult {
  message: string;
  rowCount?: number;
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/sales/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "アップロードに失敗しました");
      } else {
        setResult(json);
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Excel インポート</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          売上速報サンプルと同じ形式の Excel (.xlsx) ファイルをアップロードしてください。
          同月のデータが既にある場合は上書きされます。
        </p>
        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:bg-white file:cursor-pointer cursor-pointer"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="shrink-0"
          >
            {loading ? "処理中..." : "アップロード"}
          </Button>
        </div>
        {file && (
          <p className="text-sm text-gray-500">
            選択中: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
            {result.message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
