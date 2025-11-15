import { use } from "react";
import { fetchMisconfigPages, fetchFilteredMisconfigs } from "@/app/lib/data";
import Pagination from "@/app/ui/misconfigurations/pagination";
import Search from "./search";
import SmallMisconfigsTable from "@/app/ui/misconfigurations/small_table";
import LargeMisconfigsTable from "@/app/ui/misconfigurations/large_table";

export default function Page({ searchParams }: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>
}) {
  const { query = "", page = "1" } = use(searchParams);
  const currentPage = Number(page);
  const totalPages = use(fetchMisconfigPages(query));
  const misconfigs = use(fetchFilteredMisconfigs(query, currentPage));

  return <>
    <div className="flex items-center justify-between gap-2 mt-4 w-full">
      <Search />
    </div>
    <div className="mt-6 inline-block w-full align-middle rounded-lg bg-gray-100 p-3">
      <SmallMisconfigsTable className="md:hidden" misconfigs={misconfigs} />
      <LargeMisconfigsTable
        className="hidden md:inline w-full space-y-3"
        misconfigs={misconfigs}
      />
    </div>
    <div className="mt-5 flex w-full justify-center">
      <Pagination totalPages={totalPages} />
    </div>
  </>
}
