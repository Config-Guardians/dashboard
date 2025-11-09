import { fetchFilteredMisconfigs } from "@/app/lib/data";
import { CardsSkeleton, ChartSkeleton } from "@/app/ui/skeletons";
import BarChartProviders from "./BarChartProviders";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  let misconfigs;
  try {
    misconfigs = await fetchFilteredMisconfigs("", 1);
  } catch (error) {
    console.error(error);
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-4">
          <CardsSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (!misconfigs) {
    return (
      <div className="grid grid-cols-3 gap-4 p-6">
        <CardsSkeleton />
      </div>
    );
  }

  const counts = {
    aws: misconfigs.filter((m) => m.provider === "aws").length,
    gcp: misconfigs.filter((m) => m.provider === "gcp").length,
    oracle: misconfigs.filter((m) => m.provider === "oracle").length,
  };

  const cards = [
    { title: "AWS Misconfigs", count: counts.aws },
    { title: "GCP Misconfigs", count: counts.gcp },
    { title: "Oracle Misconfigs", count: counts.oracle },
  ];

  const chartData = [
    { provider: "AWS", count: counts.aws },
    { provider: "GCP", count: counts.gcp },
    { provider: "Oracle", count: counts.oracle },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ title, count }) => (
          <div
            key={title}
            className="rounded-xl bg-white border shadow-sm hover:shadow-md transition-transform duration-150 hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>
            <div className="flex items-center justify-center py-10">
              <p className="text-4xl font-bold text-gray-800">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TODO: Bar chart for now, to replace with line chart of misconfigs over time when time is added in schema */}
      <BarChartProviders data={chartData} />
    </div>
  );
}
