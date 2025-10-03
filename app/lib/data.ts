import { BackendError, Misconfig, MisconfigPreview } from "./definitions";
import { extractProvider } from "./utils";
import { env } from "node:process";

const { HACHIWARE_URL } = env;

const ITEMS_PER_PAGE = 6;
const misconfigPreviewFields = new URLSearchParams({
  "fields[report]": [
    "timing",
    "original_filename",
    "patched_content",
  ].join(","),
});

export async function fetchFilteredMisconfigs(
  query: string,
  currentPage: number,
): Promise<MisconfigPreview[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  return fetch(
    `${HACHIWARE_URL}/report?${misconfigPreviewFields}`,
  ).then<
    {
      data: {
        attributes: Omit<MisconfigPreview, "provider" | "id">;
        id: string;
      }[];
    }
  >((res) => res.json())
    .then(
      ({ data }) =>
        data.map(({ attributes, id }) => ({
          ...attributes,
          id,
          provider: extractProvider(attributes.patched_content),
        })),
    ).catch((error) => {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch misconfigurations.");
    });

  //     await sql<MisconfigPreview[]>`
  //   SELECT
  //     id,
  //     original_filename,
  //     patched_content,
  //     date_detected
  //   FROM reports
  //   WHERE
  //     id::text ILIKE ${`%${query}%`} OR
  //     original_filename ILIKE ${`%${query}%`} OR
  //     patched_content ILIKE ${`%${query}%`} OR
  //     date_detected::text ILIKE ${`%${query}%`}
  //   ORDER BY date_detected DESC
  //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  // `;
}

export async function fetchMisconfigPages(query: string) {
  return fetch(
    `${HACHIWARE_URL}/report?${new URLSearchParams({
      "page[count]": "true",
      "page[limit]": "1",
      "fields[report]": "created_at",
    })}`,
  )
    .then<{ meta: { page: { total: number } } }>((res) => res.json())
    .then(({ meta: { page: { total } } }) => total)
    .then((entries) => Math.ceil(entries / ITEMS_PER_PAGE));
  // try {
  //   const data = await sql`
  //     SELECT COUNT(*)
  //     FROM reports
  //     WHERE
  //       reports.id::text ILIKE ${`%${query}%`} OR
  //       reports.original_filename ILIKE ${`%${query}%`} OR
  //       reports.patched_content ILIKE ${`%${query}%`} OR
  //       reports.date_detected::text ILIKE ${`%${query}%`}
  //       `;
  //
  //   const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  //   return totalPages;
  // } catch (error) {
  //   console.error("Database Error:", error);
  //   throw new Error("Failed to fetch total number of misconfigs.");
  // }
}

type FetchMisconfig = {
  data: {
    attributes: Omit<Misconfig, "provider" | "id">;
    id: string;
  };
};

export function fetchMisconfigById(
  id: string,
): Promise<Misconfig | null> {
  return fetch(`${HACHIWARE_URL}/report/${encodeURIComponent(id)}`)
    .then<FetchMisconfig | BackendError>((req) => req.json())
    .then((res) => {
      if ("errors" in res) {
        throw new Error(JSON.stringify(res));
      }
      const { data: { attributes, id } } = res;
      return {
        ...attributes,
        id,
        provider: extractProvider(attributes.patched_content),
      };
    })
    .catch((error) => {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch misconfiguration.");
    });
  // try {
  //   const data = await sql<Misconfig[]>`
  //     SELECT
  //       id,
  //       original_filename,
  //       patched_content,
  //       date_detected,
  //       policy_compliance,
  //       changes_summary,
  //       violations_analysis,
  //       validation_details,
  //       policy_details,
  //       timing
  //     FROM reports
  //     WHERE id = ${id};
  //   `;
  //   if (!data[0]) return null;
  //
  //   const misconfigWithProvider = {
  //     ...data[0],
  //     provider: extractProvider(data[0].patched_content),
  //   };
  //
  //   return misconfigWithProvider;
  // } catch (error) {
  //   console.error("Database Error:", error);
  //   throw new Error("Failed to fetch misconfiguration.");
  // }
}
