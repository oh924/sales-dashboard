import UploadForm from "@/components/UploadForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <div className="max-w-xl py-6 space-y-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Excel インポート</h1>
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm">← ダッシュボードへ</Button>
        </Link>
      </div>
      <UploadForm />
    </div>
  );
}
