import { fetchMisconfigById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { CodeMisconfigView } from "@/app/ui/misconfigurations/code_misconfig_view";
import { CloudMisconfigView } from "@/app/ui/misconfigurations/cloud_misconfig_view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const misconfig = await fetchMisconfigById(decodeURIComponent(id));

  if (!misconfig) return notFound();

  const type = misconfig.type || "cloud";

  // Switch based on type (TODO: change to misconfig.type when schema changes)
  switch (type) {
    case "code":
      return <CodeMisconfigView misconfig={misconfig} id={id} />;

    case "cloud":
      // return <CloudMisconfigView misconfig={misconfig} id={id} />;
      return <CloudMisconfigView />;

    // TODO: change type to misconfig.type when schema changes
    default:
      return (
        <main className="p-6">
          <h1 className="text-2xl font-bold">Unknown Misconfiguration Type</h1>
          <p>Type: {type || "undefined"}</p>
        </main>
      );
  }
}