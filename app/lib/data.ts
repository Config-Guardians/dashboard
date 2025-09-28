import postgres from "postgres";
import { Misconfig, MisconfigsTable } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!);

const ITEMS_PER_PAGE = 6;

function extractProvider(patchedContent: string): string | null {
  const match = patchedContent.match(/provider\s+"([^"]+)"/);
  return match ? match[1] : null;
}

export async function fetchFilteredMisconfigs(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const misconfigs = await sql<MisconfigsTable[]>`
      SELECT
        id,
        original_filename,
        patched_content,
        date_detected
      FROM reports
      WHERE
        id::text ILIKE ${`%${query}%`} OR
        original_filename ILIKE ${`%${query}%`} OR
        patched_content ILIKE ${`%${query}%`} OR
        date_detected::text ILIKE ${`%${query}%`}
      ORDER BY date_detected DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return misconfigs.map((m) => ({
      ...m,
      provider: extractProvider(m.patched_content),
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch misconfigurations.");
  }
}

export async function fetchMisconfigPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM reports
      WHERE
        reports.id::text ILIKE ${`%${query}%`} OR
        reports.original_filename ILIKE ${`%${query}%`} OR
        reports.patched_content ILIKE ${`%${query}%`} OR
        reports.date_detected::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of misconfigs.");
  }
}

export async function fetchMisconfigById(id: string) {
  try {
    const data = await sql<Misconfig[]>`
      SELECT
        id,
        original_filename,
        patched_content,
        date_detected,
        policy_compliance,
        changes_summary,
        violations_analysis,
        validation_details,
        policy_details,
        timing
      FROM reports
      WHERE id = ${id};
    `;
    if (!data[0]) return null;

    const misconfigWithProvider = {
      ...data[0],
      provider: extractProvider(data[0].patched_content),
    };

    return misconfigWithProvider;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch misconfiguration.");
  }
}