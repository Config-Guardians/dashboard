import fs from "fs/promises";
import path from "path";
import postgres from "postgres";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const sql = postgres(process.env.POSTGRES_URL!);

// helper: load JSON file
async function loadJSON<T>(filename: string): Promise<T> {
  const filePath = path.join(process.cwd(), "app/data", filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function seedVulnReports() {
  const reports = await loadJSON<any[]>("vuln_reports.json");

  // table
  await sql`
    CREATE TABLE IF NOT EXISTS vuln_reports (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      provider TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      patched_content TEXT NOT NULL,
      severity TEXT NOT NULL,
      date_detected TIMESTAMPTZ NOT NULL,
      policy_compliance JSONB NOT NULL,
      changes_summary JSONB NOT NULL,
      violations_analysis JSONB NOT NULL,
      raw JSONB NOT NULL
    )
  `;

  // insert
  for (const report of reports) {
    await sql`
      INSERT INTO vuln_reports (
        provider,
        original_filename,
        patched_content,
        severity,
        date_detected,
        policy_compliance,
        changes_summary,
        violations_analysis,
        raw
      )
      VALUES (
        ${report.provider},
        ${report.original_filename},
        ${report.patched_content},
        ${report.severity},
        ${report.date_detected},
        ${report.policy_compliance},
        ${report.changes_summary},
        ${report.violations_analysis},
        ${report}::jsonb
      )
      ON CONFLICT DO NOTHING
    `;
  }
}

export async function GET() {
  try {
    await seedVulnReports();
    return Response.json({ message: "Vulnerability reports seeded successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
