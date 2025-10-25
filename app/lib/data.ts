import { BackendError, Misconfig, MisconfigPreview } from "./definitions";
import { extractProvider } from "./utils";
import { env } from "node:process";
import { NextResponse } from "next/server";

const { HACHIWARE_URL } = env;

const ITEMS_PER_PAGE = 6;
const misconfigPreviewFields = new URLSearchParams({
  "fields[report]": [
    "timing",
    "original_filename",
    "patched_content",
  ].join(","),
  "page[limit]": ITEMS_PER_PAGE.toString(),
});

export async function fetchFilteredMisconfigs(
  query: string,
  currentPage: number,
): Promise<MisconfigPreview[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  return fetch(`${HACHIWARE_URL}/report${query ? `/filter/${query}` : ""}?${misconfigPreviewFields}&page[offset]=${offset}`)
    .then<
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

const countMisconfigPages = new URLSearchParams({
  "page[count]": "true",
  "page[limit]": "1",
  "fields[report]": "created_at",
});

export async function fetchMisconfigPages(query: string) {
  return fetch(`${HACHIWARE_URL}/report${query ? `/filter/${query}` : ""}?${countMisconfigPages}`)
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

export async function fetchMisconfigById(
  id: string,
): Promise<Misconfig | null> {
  return fetch(`${HACHIWARE_URL}/report/${encodeURIComponent(id)}`)
    .then<FetchMisconfig | BackendError>((req) => req.json())
    .then((res) => {
      if ("errors" in res) {
        console.error("API Error:", res);
        return null;
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

export async function postPlugin(req: Request) {
  const body = await req.json();

  try {
    const res = await fetch(`${HACHIWARE_URL}/plugin`, {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error proxying to backend:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}