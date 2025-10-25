import Image from "next/image";
import { ViewMisconfig } from "./buttons";
import { formatDate } from "@/app/lib/utils";
import { MisconfigPreview } from "@/app/lib/definitions";

export default function LargeMisconfigsTable(
  { misconfigs, className }: {
    misconfigs?: MisconfigPreview[];
    className: string;
  },
) {
  return (
    <div className={className}>
      <table className="min-w-full text-gray-900">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            {["Provider", "Resource", "Misconfiguration ID", "Date"].map(
              (text, idx) => (
                <th key={idx}
                  scope="col"
                  className="px-4 py-5 font-medium"
                >
                  {text}
                </th>
              ),
            )}
            <th
              scope="col"
              className="relative py-3 pl-6 pr-3"
            >
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {misconfigs?.map((
            {
              id,
              original_filename,
              provider,
              timing: { remediation_start_time }
            },
            idx,
          ) => (
            <tr
              key={idx}
              className="w-full border-y py-3 text-sm rounded-lg"
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3 flex items-center gap-3">
                <Image
                  src={`/providers/${provider}.png`}
                  className="rounded-full"
                  width={50}
                  height={50}
                  alt={`${provider}'s logo`}
                />
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {original_filename}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {id}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {formatDate(remediation_start_time)}
              </td>
              <td className="whitespace-nowrap py-3 pl-6 pr-3 flex justify-end gap-3">
                <ViewMisconfig id={id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
