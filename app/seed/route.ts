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
  const reports = await loadJSON<any[]>("midterm_reports2.json");

  // table
  await sql`
  CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_filename TEXT NOT NULL,
    patched_content TEXT NOT NULL,
    date_detected TIMESTAMPTZ DEFAULT NOW(),

    -- structured JSON fields
    policy_compliance JSONB NOT NULL,
    changes_summary JSONB NOT NULL,
    violations_analysis JSONB NOT NULL,
    validation_details JSONB NOT NULL,
    policy_details JSONB NOT NULL,
    timing JSONB NOT NULL,

    -- store the raw full report for safety
    raw JSONB NOT NULL
  );
`;

  // insert
  for (const report of reports) {
    await sql`
      INSERT INTO reports (
        original_filename,
        patched_content,
        policy_compliance,
        changes_summary,
        violations_analysis,
        validation_details,
        policy_details,
        timing,
        raw
      )
      VALUES (
        ${report.original_filename},
        ${report.patched_content},
        ${report.policy_compliance},
        ${report.changes_summary},
        ${report.violations_analysis},
        ${report.validation_details},
        ${report.policy_details},
        ${report.timing},
        ${report}::jsonb
      )
      ON CONFLICT DO NOTHING
    `;
  }
}

export async function GET() {
  try {
    await seedVulnReports();
    return Response.json({
      message: "Vulnerability reports seeded successfully",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
