import { fetchFilteredMisconfigs } from "@/app/lib/data";
import SmallMisconfigsTable from "./small_table";
import LargeMisconfigsTable from "./large_table";

export default async function MisconfigsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const misconfigs = await fetchFilteredMisconfigs(query, currentPage);

  return (
    <div className="mt-6 flow-root inline-block min-w-full align-middle rounded-lg bg-gray-50 p-2 md:pt-0">
      <SmallMisconfigsTable className="md:hidden" misconfigs={misconfigs} />
      <LargeMisconfigsTable
        className="hidden md:table w-full"
        misconfigs={misconfigs}
      />
    </div>
  );
}
