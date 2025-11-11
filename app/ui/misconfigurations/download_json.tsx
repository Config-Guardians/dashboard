"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export function DownloadJSON({ data, filename }: { data: any; filename: string }) {
  const handleDownload = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <ArrowDownTrayIcon className="w-5" />
    </button>
  );
}
