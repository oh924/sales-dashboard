import NavBar from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="p-4 max-w-screen-xl mx-auto">{children}</main>
    </div>
  );
}
