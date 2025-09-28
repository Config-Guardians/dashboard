import Image from "next/image";
import {
  ViewMisconfig,
  DeleteMisconfig,
} from "@/app/ui/misconfigurations/buttons";
import { formatDate } from "@/app/lib/utils";
import { fetchFilteredMisconfigs } from "@/app/lib/data";

export default async function MisconfigsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const misconfigs = await fetchFilteredMisconfigs(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {misconfigs?.map((misconfig) => (
              <div
                key={misconfig.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={`/providers/${(misconfig.provider ?? "default").toLowerCase()}.png`}
                        className="rounded-full"
                        width={50}
                        height={50}
                        alt={`${misconfig.provider}'s logo`}
                      />
                      {/* <p>{misconfig.provider}</p> */}
                    </div>
                    <p className="text-sm text-gray-500">
                      {misconfig.original_filename}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    {/* <p className="text-sm text-gray-500">
                      {misconfig.severity}
                    </p> */}
                    <p>{formatDate(misconfig.date_detected)}</p>
                    <p className="text-sm text-gray-500">{misconfig.id}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ViewMisconfig id={misconfig.id} />
                    <DeleteMisconfig id={misconfig.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Provider
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Resource
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  Severity
                </th> */}
                <th scope="col" className="px-3 py-5 font-medium">
                  Misconfiguration ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {misconfigs?.map((misconfig) => (
                <tr
                  key={misconfig.original_filename}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={`/providers/${(misconfig.provider ?? "default").toLowerCase()}.png`}
                        className="rounded-full"
                        width={50}
                        height={50}
                        alt={`${misconfig.provider}'s logo`}
                      />
                      {/* <p>{misconfig.provider}</p> */}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {misconfig.original_filename}
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-3">
                    {misconfig.severity}
                  </td> */}
                  <td className="whitespace-nowrap px-3 py-3">
                    {misconfig.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDate(misconfig.date_detected)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewMisconfig id={misconfig.id} />
                      <DeleteMisconfig id={misconfig.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
