import Image from "next/image";
import { ViewMisconfig } from "@/app/ui/misconfigurations/buttons";
import { MisconfigPreview } from "@/app/lib/definitions";
import { formatDateTime } from "@/app/lib/utils";

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
          misconfig,
          idx
        ) => {
          const { id, provider, type } = misconfig
          return <div
            key={idx}
            className="mb-3 w-full rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="border-b w-full flex">
              <Image
                src={`/providers/${provider}.png`}
                className="rounded-full"
                width={50}
                height={50}
                alt={`${provider}'s logo`}
              />
              <div className="overflow-hidden">
                <p className="text-gray-700 font-medium">{type === "code" ? misconfig.original_filename : misconfig.name}</p>
                <p className="text-sm truncate">{type === "code" ? misconfig.patched_content : misconfig.command}</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-between pt-4">
              <p className="text-sm text-gray-500">{formatDateTime(id)}</p>
              <ViewMisconfig id={id} />
            </div>
          </div>
        }
      )}
    </div>
  );
}
