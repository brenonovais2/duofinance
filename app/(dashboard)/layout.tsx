import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2F5F7] text-[#0B032D] font-sans flex flex-col md:flex-row">
      <Sidebar />
      {children}
    </div>
  );
}
