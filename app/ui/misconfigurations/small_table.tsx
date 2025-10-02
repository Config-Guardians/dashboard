import Image from "next/image";
import {
    DeleteMisconfig,
    ViewMisconfig,
} from "@/app/ui/misconfigurations/buttons";
import { MisconfigPreview } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils";

export default function SmallMisconfigsTable(
    { misconfigs, className }: {
        misconfigs?: MisconfigPreview[];
        className: string;
    },
) {
    return (
        <div className={className}>
            {misconfigs?.map((
                {
                    id,
                    original_filename,
                    provider,
                    timing: { remediation_start_time }
                },
                idx,
            ) => (
                <div
                    key={idx}
                    className="mb-2 w-full rounded-md bg-white p-4"
                >
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="mb-2 flex items-center">
                            <Image
                                src={`/providers/${provider}.png`}
                                className="rounded-full"
                                width={50}
                                height={50}
                                alt={`${provider}'s logo`}
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            {original_filename}
                        </p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                        <div>
                            <p>{formatDate(remediation_start_time)}</p>
                            <p className="text-sm text-gray-500">{id}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <ViewMisconfig id={id} />
                            <DeleteMisconfig id={id} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
