import { use } from "react";
import { fetchMisconfigById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { CodeMisconfigView } from "@/app/ui/misconfigurations/code_misconfig_view";
import { CloudMisconfigView } from "@/app/ui/misconfigurations/cloud_misconfig_view";

export default function Page({
  params,
}: PageProps<"/dashboard/misconfigurations/[id]/view">) {
  const { id } = use(params);
  const misconfig = use(fetchMisconfigById(decodeURIComponent(id)));

  if (!misconfig) return notFound();

  const { type } = misconfig;

  // switch based on type: code or cloud
  switch (type) {
    case "code":
      return <CodeMisconfigView misconfig={misconfig} />;

    case "cloud":
      return <CloudMisconfigView misconfig={misconfig} />;

    default:
      return (
        <main className="p-6">
          <h1 className="text-2xl font-bold">Unknown Misconfiguration Type</h1>
          <p>Type: {type || "undefined"}</p>
        </main>
      );
  }
}
