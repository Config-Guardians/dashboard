"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export function DownloadMD({
  content,
  filename,
}: {
  content: string;
  filename: string;
}) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="rounded-md border p-2 hover:bg-gray-100"
      title="Download Markdown"
    >
      <ArrowDownTrayIcon className="w-5" />
    </button>
  );
}
