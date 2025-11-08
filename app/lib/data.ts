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
    "command"
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
        data.map(({ attributes, id }) => {
        const sourceText = attributes.patched_content || attributes.command || "";

        return {
          ...attributes,
          id,
          provider: extractProvider(sourceText),
        };
      })
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

// TO REVIEW: IDK why the previous one broke with the new misconfig union 
// can maybe fix if have time but here's a vibe coded one that works
export async function fetchMisconfigById(
  id: string,
): Promise<Misconfig | null> {
  try {
    const res = await fetch(`${HACHIWARE_URL}/report/${encodeURIComponent(id)}`);
    const json = await res.json();

    if (!json || json.errors) {
      console.error("API Error:", json);
      return null;
    }

    const attributes = json.data?.attributes;
    const fetchedId = json.data?.id ?? id;

    if (!attributes) {
      console.error("Malformed API response:", json);
      return null;
    }

    // pick whichever field is available to extract provider
    const sourceText =
      (attributes.patched_content ?? attributes.command ?? "") as string;
    const provider = extractProvider(sourceText);

    // handle based on type
    if (attributes.type === "cloud") {
      return {
        id: fetchedId,
        provider,
        type: "cloud",
        command: attributes.command ?? "",
      };
    }

    if (attributes.type === "code") {
      return {
        id: fetchedId,
        provider,
        type: "code",
        original_filename: attributes.original_filename ?? "unknown",
        patched_content: attributes.patched_content ?? "",
        policy_compliance: attributes.policy_compliance,
        changes_summary: attributes.changes_summary,
        violations_analysis: attributes.violations_analysis,
        validation_details: attributes.validation_details,
        policy_details: attributes.policy_details,
        timing: attributes.timing,
      };
    }

    // fallback for unknown type
    console.warn("Unknown misconfig type:", attributes.type);
    return null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch misconfiguration.");
  }

// export async function fetchMisconfigById(
//   id: string,
// ): Promise<Misconfig | null> {
//   return fetch(`${HACHIWARE_URL}/report/${encodeURIComponent(id)}`)
//     .then<FetchMisconfig | BackendError>((req) => req.json())
//     .then((res) => {
//       if ("errors" in res) {
//         console.error("API Error:", res);
//         return null;
//       }
//       const { data: { attributes, id } } = res;
//       return {
//         ...attributes,
//         id,
//         provider: extractProvider(attributes.patched_content || attributes.command || ""),
//       };
//     })
//     .catch((error) => {
//       console.error("Database Error:", error);
//       throw new Error("Failed to fetch misconfiguration.");
//     });
//   }
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