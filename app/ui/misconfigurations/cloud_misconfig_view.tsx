"use client";

import Image from "next/image";
import { formatDate } from "@/app/lib/utils";
import { DownloadMD } from "@/app/ui/misconfigurations/download_md";
import ReactMarkdown from "react-markdown";
import { CloudMisconfig } from "@/app/lib/definitions";

export function CloudMisconfigView({
  misconfig,
}: {
  misconfig: CloudMisconfig;
}) {
  const {
    command,
    name,
    provider,
    id
  } = misconfig;

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            {name || "Cloud Misconfiguration Report"}
          </h1>
          <DownloadMD
            content={command}
            filename={`${name}-${id}.md`}
          />
        </div>
        <p className="text-gray-500">
          Detected:{" "}
          {formatDate(id)}
        </p>
      </div>

      {/* Provider */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Provider:</h2>
        {provider ? (
          <Image
            src={`/providers/${provider}.png`}
            alt={provider}
            width={40}
            height={40}
            className="object-contain"
          />
        ) : (
          <span className="text-gray-500">Unknown</span>
        )}
      </div>

      {/* Markdown Report */}
      <div className="text-base leading-relaxed text-gray-800 space-y-3">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mt-4 mb-2 border-b pb-1">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc list-inside ml-5 mb-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside ml-5 mb-2">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code({ inline, className, children, ...props }: any) {
              return inline ? (
                <code
                  className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <pre className="bg-gray-100 rounded p-3 overflow-x-auto text-sm font-mono mb-3">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
          }}
        >
          {command}
        </ReactMarkdown>
      </div>
    </main>
  );
}
