import Pagination from "@/app/ui/misconfigurations/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/misconfigurations/table";
import { lusitana } from "@/app/ui/fonts";
import { MisconfigsTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchMisconfigPages } from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchMisconfigPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Misconfigurations</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search misconfigurations..." />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<MisconfigsTableSkeleton />}
      >
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}