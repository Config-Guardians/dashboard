import Search from "@/app/ui/search"
import Pagination from "@/app/ui/misconfigurations/pagination";
import { use } from "react";
import { fetchFilteredMisconfigs, fetchMisconfigPages } from "@/app/lib/data";
import SmallMisconfigsTable from "@/app/ui/misconfigurations/small_table";
import LargeMisconfigsTable from "@/app/ui/misconfigurations/large_table";

export default function Page({ searchParams }: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const { query = "", page = "1" } = use(searchParams!)
  const totalPages = use(fetchMisconfigPages(query));
  const misconfigs = use(fetchFilteredMisconfigs(query, parseInt(page)));

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search misconfigurations..." />
      </div>
      <div className="mt-6 flow-root min-w-full align-middle rounded-lg bg-gray-50 p-2 md:pt-0">
        <SmallMisconfigsTable className="md:hidden" misconfigs={misconfigs} />
        <LargeMisconfigsTable
          className="hidden md:table w-full"
          misconfigs={misconfigs}
        />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
