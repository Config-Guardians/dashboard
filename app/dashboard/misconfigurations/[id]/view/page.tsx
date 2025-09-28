import { fetchMisconfigById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime } from "@/app/lib/utils";
import Image from "next/image";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const misconfig = await fetchMisconfigById(id);

  if (!misconfig) return notFound();

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{misconfig.original_filename}</h1>
        <p className="text-gray-500">
          Detected: {formatDate(misconfig.date_detected)}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Provider:</h2>
        {misconfig.provider ? (
          <Image
            src={`/providers/${misconfig.provider.toLowerCase()}.png`}
            alt={misconfig.provider}
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
          {misconfig.patched_content}
        </pre>
      </div>

      {/* Policy Compliance */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Policy Compliance</h2>
        <ul className="list-disc list-inside">
          <li>
            Violations Detected:{" "}
            {misconfig.policy_compliance.violations_detected}
          </li>
          <li>
            Validation Status: {misconfig.policy_compliance.validation_status}
          </li>
          <li>
            Policy File Used: {misconfig.policy_compliance.policy_file_used}
          </li>
        </ul>
      </div>

      {/* Changes Summary */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Changes Summary</h2>
        <p>Total Changes: {misconfig.changes_summary.total_changes}</p>
        <ul className="list-disc list-inside">
          {misconfig.changes_summary.changes_detail.map((change, index) => (
            <li key={index}>
              <strong>{change.type}</strong>: {change.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Violations Analysis */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Violations Analysis</h2>
        <p>{misconfig.violations_analysis.raw_violations}</p>
      </div>

      {/* Validation Details */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Validation Details</h2>
        <p>Original File Validation:</p>
        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded mb-2">
          {misconfig.validation_details.original_file_validation}
        </pre>
        <p>Patched File Validation:</p>
        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded">
          {misconfig.validation_details.patched_file_validation}
        </pre>
      </div>

      {/* Policy Details */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Policy Details</h2>
        <ul className="list-disc list-inside">
          <li>Policy File: {misconfig.policy_details.policy_file}</li>
          <li>Rule: {misconfig.policy_details.specific_rule}</li>
          <li>Required Value: {misconfig.policy_details.required_value}</li>
        </ul>
      </div>

      {/* Timing */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Timing</h2>
        <p>Start: {formatDateTime(misconfig.timing.remediation_start_time)}</p>
        <p>End: {formatDateTime(misconfig.timing.remediation_end_time)}</p>
        <p>Total Duration (s): {misconfig.timing.total_duration_seconds}</p>
      </div>
    </main>
  );
}
