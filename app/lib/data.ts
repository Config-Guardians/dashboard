import postgres from 'postgres';
import { MisconfigsTable } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!);

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredMisconfigs(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const misconfigs = await sql<MisconfigsTable[]>`
      SELECT
        id,
        provider,
        original_filename,
        severity,
        date_detected
      FROM vuln_reports
      WHERE
        provider ILIKE ${`%${query}%`} OR
        original_filename ILIKE ${`%${query}%`} OR
        severity ILIKE ${`%${query}%`} OR
        date_detected::text ILIKE ${`%${query}%`}
      ORDER BY date_detected DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return misconfigs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch misconfigurations.');
  }
}

export async function fetchMisconfigPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM vuln_reports
      WHERE
        vuln_reports.original_filename ILIKE ${`%${query}%`} OR
        vuln_reports.severity ILIKE ${`%${query}%`} OR
        vuln_reports.date_detected::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of misconfigs.');
  }
}