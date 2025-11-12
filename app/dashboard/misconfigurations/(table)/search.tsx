import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form"

export default function Search({ query }: { query: string }) {
  return (
    <div className="relative flex w-full">
      <Form action="/dashboard/misconfigurations" className="w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block flex-1 w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search misconfigurations..."
          name="query"
          defaultValue={query}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </Form>
    </div>
  );
}
