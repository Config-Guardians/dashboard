import SideNav from "@/app/ui/dashboard/sidenav";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex grow items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Placeholder
          </h1>
          <Image
            src="/captamerica.png"
            width={600}
            height={400}
            alt="Dashboard placeholder"
            className="rounded-lg shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}
