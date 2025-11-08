import Image from "next/image";
import { ViewMisconfig } from "@/app/ui/misconfigurations/buttons";
import { MisconfigPreview } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils";

export default function LargeMisconfigsTable({
  misconfigs,
  className,
}: {
  misconfigs?: MisconfigPreview[];
  className: string;
}) {
  return (
    <div className={className}>
      {misconfigs?.map(
        (
          {
            id,
            original_filename,
            provider,
            timing,
          },
          idx
        ) => (
          <div
            key={idx}
            className="mb-3 w-full rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-3">
                <Image
                  src={`/providers/${provider}.png`}
                  className="rounded-full"
                  width={50}
                  height={50}
                  alt={`${provider}'s logo`}
                />
                <p className="text-gray-700 font-medium">{original_filename}</p>
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(timing?.remediation_start_time ?? "")}
              </p>
            </div>

            <div className="flex w-full items-center justify-between pt-4">
              <p className="text-sm text-gray-500">{id}</p>
              <div className="flex justify-end gap-2">
                <ViewMisconfig id={id} />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
