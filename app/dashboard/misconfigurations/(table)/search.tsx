"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { redirect, RedirectType, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams()
  const handleSearch = useDebouncedCallback(term => {
    redirect(`/dashboard/misconfigurations?${new URLSearchParams({ query: term })}`, RedirectType.push)
  })
  return (
    <div className="relative flex w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block flex-1 w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder="Search misconfigurations..."
        onChange={({ target: { value } }) => handleSearch(value)}
        defaultValue={searchParams.get("query") || ""}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
