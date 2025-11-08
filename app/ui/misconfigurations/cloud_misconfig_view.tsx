"use client";

import Image from "next/image";
import { formatDate } from "@/app/lib/utils";
import { DownloadMD } from "@/app/ui/misconfigurations/download_md";
import ReactMarkdown from "react-markdown";

/* 
// TODO: change to receive actual cloud misconfigs instead of hardcoded mock data
export function CloudMisconfigView({
  misconfig,
  id,
}: {
  misconfig: any;
  id: string;
}) {
  const {
    original_filename,
    provider,
    timing,
    markdown_report, // plain markdown string
  } = misconfig;
*/

export function CloudMisconfigView() {
  // Temporary hardcoded mock data for local testing
  const misconfig = {
    type: "cloud",
    original_filename: "awsreport.md",
    provider: "aws",
    timing: { remediation_start_time: new Date().toISOString() },
    markdown_report: `
The given security group rule allows all egress traffic (IPv4 CIDR 0.0.0.0/0, protocol -1, from_port -1 to_port -1), which is very permissive and could be a security risk.

## Recommended steps to fix this

1. Revoke the existing egress rule that allows all outbound traffic.
2. Add more restricted egress rules according to your specific use case (e.g., allow outbound HTTP and HTTPS only).

Below are example AWS CLI commands for these steps.

### Step 1: Revoke the permissive egress rule

\`\`\`bash
aws ec2 revoke-security-group-egress \\
    --group-id <security-group-id> \\
    --ip-permissions '[{"IpProtocol": "-1", "FromPort": -1, "ToPort": -1, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
\`\`\`

Replace <security-group-id> with the actual security group ID this rule belongs to.

### Step 2: Add restricted egress rules (example allowing outbound HTTP and HTTPS)

\`\`\`bash
aws ec2 authorize-security-group-egress \\
    --group-id <security-group-id> \\
    --ip-permissions '[{"IpProtocol": "tcp", "FromPort": 80, "ToPort": 80, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
\`\`\`

\`\`\`bash
aws ec2 authorize-security-group-egress \\
    --group-id <security-group-id> \\
    --ip-permissions '[{"IpProtocol": "tcp", "FromPort": 443, "ToPort": 443, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
\`\`\`

### Summary
- First remove the existing very open egress rule.
- Then add finer-grained egress rules that limit outbound traffic ports and protocols.

If your use case requires different allowed egress traffic, modify the authorized rules accordingly.

Let me know if you need help forming the commands for specific egress traffic rules.
`,
  };

  const { original_filename, provider, timing, markdown_report } = misconfig;
  const id = "mock-id"; // placeholder

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{original_filename}</h1>
          <DownloadMD
            content={misconfig.markdown_report}
            filename={original_filename || `misconfiguration.${id}.json`}
          />
        </div>
        <p className="text-gray-500">
          Detected: {formatDate(timing?.remediation_start_time)}
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
            code({ inline, className, children, ...props }) {
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
          {markdown_report}
        </ReactMarkdown>
      </div>
    </main>
  );
}
