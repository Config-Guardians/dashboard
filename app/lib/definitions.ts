// Type definitions for data

export type Misconfig = {
  id: string; // database generated ID from postgres
  original_filename: string;
  patched_content: string;
  provider?: string;
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
  validation_details: {
    original_file_validation: string;
    patched_file_validation: string;
    original_tests_summary: {
      total_tests: number;
      passed: number;
      warnings: number;
      failures: number;
      exceptions: number;
    };
    patched_tests_summary: {
      total_tests: number;
      passed: number;
      warnings: number;
      failures: number;
      exceptions: number;
    };
  };
  policy_details: {
    policy_file: string;
    specific_rules: string[];
  };
  timing: {
    remediation_start_time: string;
    remediation_end_time: string;
    total_duration_seconds: number;
  };
};

// for misconfiguration table view
export type MisconfigsTable = {
  id: string;
  patched_content: string;
  provider?: string;
  original_filename: string;
  date_detected: string;
};
