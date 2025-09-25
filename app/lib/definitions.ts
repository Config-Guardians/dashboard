// Type definitions for data

export type Misconfig = {
  id: string; // database generated ID from postgres
  provider: string;
  original_filename: string;
  patched_content: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; // placeholder, subject to changes
  date_detected: string; // ISO datetime string
  policy_compliance: {
    violations_detected: number;
    validation_status: "PASSED" | "FAILED";
    policy_file_used: string;
  };
  changes_summary: {
    total_changes: number;
    changes_detail: {
      type: "ADDED" | "REMOVED" | "MODIFIED";
      content: string;
      description: string;
    }[];
  };
  violations_analysis: {
    raw_violations: string;
  };
};

// for misconfiguration table view
export type MisconfigsTable = {
  id: string;
  provider: string;
  original_filename: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  date_detected: string;
};
