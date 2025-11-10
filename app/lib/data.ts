import { BackendError, Misconfig, MisconfigPreview } from "./definitions";
import { extractProvider } from "./utils";
import { env } from "node:process";
import { NextResponse } from "next/server";

const { HACHIWARE_URL } = env;

export const ITEMS_PER_PAGE = 6;
const misconfigPreviewFields = new URLSearchParams({
  "fields[report]": [
    "timing",
    "original_filename",
    "patched_content",
    "command",
    "name",
    "type"
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
          attributes: MisconfigPreview;
          id: string;
        }[];
      }
    >((res) => res.json())
    .then(
      ({ data }) =>
        data.map(({ attributes, id }) => {
          const sourceText = attributes.type === "code"
            ? attributes.patched_content
            : attributes.command;

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
}

type FetchMisconfig = {
  data: {
    attributes: Misconfig;
    id: string;
  };
};

// TO REVIEW: IDK why the previous one broke with the new misconfig union 
// can maybe fix if have time but here's a vibe coded one that works
export async function fetchMisconfigById(
  id: string,
): Promise<Misconfig | null> {
  return fetch(`${HACHIWARE_URL}/report/${encodeURIComponent(id)}`)
    .then<FetchMisconfig | BackendError>(res => res.json())
    .then(data => {
      if ("errors" in data)
        return null
      const { data: { attributes } } = data
      return {
        ...attributes,
        provider: extractProvider(attributes.type === "code"
          ? attributes.patched_content :
          attributes.command), id
      }
    })
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
