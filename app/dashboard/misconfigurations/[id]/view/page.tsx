import { fetchMisconfigById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime } from "@/app/lib/utils";
import Image from "next/image";
import { AnsiUp } from "ansi-up";
import { DownloadButton } from "@/app/ui/misconfigurations/download_button";

const ansi_up = new AnsiUp();

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const misconfig = await fetchMisconfigById(decodeURIComponent(id));

  if (!misconfig) return notFound();
  const {
    original_filename,
    patched_content,
    changes_summary,
    timing,
    provider,
    policy_compliance,
    policy_details,
    violations_analysis,
    validation_details,
  } = misconfig;

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{original_filename}</h1>
          <DownloadButton
            data={misconfig}
            filename={original_filename || `misconfiguration.${id}.json`}
          />
        </div>
        <p className="text-gray-500">
          Detected: {formatDate(timing.remediation_start_time)}
        </p>
      </div>

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

      {/* Patched Content */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Patched Content</h2>
        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded overflow-x-auto">
          {patched_content}
        </pre>
      </div>

      {/* Policy Compliance */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Policy Compliance</h2>
        <ul className="list-disc list-inside">
          <li>Violations Detected: {policy_compliance.violations_detected}</li>
          <li>Validation Status: {policy_compliance.validation_status}</li>
          <li>Policy File Used: {policy_compliance.policy_file_used}</li>
        </ul>
      </div>

      {/* Changes Summary */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Changes Summary</h2>
        <p>Total Changes: {changes_summary.total_changes}</p>
        <ul className="list-disc list-inside">
          {changes_summary.changes_detail.map(
            ({ type, description }, index) => (
              <li key={index}>
                <strong>{type}</strong>: {description}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Violations Analysis */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Violations Analysis</h2>
        <p
          dangerouslySetInnerHTML={{
            __html: ansi_up.ansi_to_html(violations_analysis.raw_violations),
          }}
        />
      </div>

      {/* Validation Details */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Validation Details</h2>
        <p>Original File Validation:</p>
        <pre
          className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded mb-2"
          dangerouslySetInnerHTML={{
            __html: ansi_up.ansi_to_html(
              validation_details.original_file_validation
            ),
          }}
        />
        <p>Patched File Validation:</p>
        <pre
          className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded"
          dangerouslySetInnerHTML={{
            __html: ansi_up.ansi_to_html(
              validation_details.patched_file_validation
            ),
          }}
        />
      </div>

      {/* Policy Details */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Policy Details</h2>
        <ul className="list-disc list-inside">
          <li>Policy File: {policy_details.policy_file}</li>
          {policy_details.specific_rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>

      {/* Timing */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Timing</h2>
        <p>Start: {formatDateTime(timing.remediation_start_time)}</p>
        <p>End: {formatDateTime(timing.remediation_end_time)}</p>
        <p>Total Duration (s): {timing.total_duration_seconds} seconds</p>
      </div>
    </main>
  );
}
