import NavBar from "@/components/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="p-4 max-w-screen-2xl mx-auto">{children}</main>
    </div>
  );
}
