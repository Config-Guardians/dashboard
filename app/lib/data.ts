import { BackendError, Misconfig, MisconfigPreview } from "./definitions";
import { extractProvider } from "./utils";
import { env } from "node:process";

const { NEXT_PUBLIC_HACHIWARE_URL } = env;

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

  return fetch(`${NEXT_PUBLIC_HACHIWARE_URL}/report${query ? `/filter/${encodeURIComponent(query)}` : ""}?${misconfigPreviewFields}&page[offset]=${offset}`)
    .then<
      {
        data: {
          attributes: MisconfigPreview;
          id: string;
        }[];
      }
    >(res => res.json())
    .then(
      ({ data }) =>
        data.map(({ attributes, id }) => ({
          ...attributes,
          id,
          provider: interpretProvider(attributes),
        }))
    ).catch((error) => {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch misconfigurations.");
    });
}

const misconfigCountSearchParam = new URLSearchParams({
  "page[count]": "true",
  "page[limit]": "1",
  "fields[report]": "created_at",
});

export async function fetchMisconfigCounts() {
  return fetch(`${NEXT_PUBLIC_HACHIWARE_URL}/report?${new URLSearchParams({
    "fields[report]": [
      "created_at",
      "type",
      "patched_content",
      "command"
    ].join(",")
  })}`)
    .then<{ data: { attributes: MisconfigPreview }[] }>(res => res.json())
    .then(({ data }) => data.map(({ attributes: misconfig }) => interpretProvider(misconfig)))
}

export async function fetchMisconfigPages(query = "") {
  return fetch(`${NEXT_PUBLIC_HACHIWARE_URL}/report${query ? `/filter/${encodeURIComponent(query)}` : ""}?${misconfigCountSearchParam}`)
    .then<{ data: { attributes: MisconfigPreview }[] } & { meta: { page: { total: number } } }>(res => res.json())
    .then(({ meta: { page: { total } } }) => total)
    .then(entries => Math.ceil(entries / ITEMS_PER_PAGE));
}

type FetchMisconfig = {
  data: {
    attributes: Misconfig;
    id: string;
  };
};

export async function fetchMisconfigById(
  id: string,
): Promise<Misconfig | null> {
  return fetch(`${NEXT_PUBLIC_HACHIWARE_URL}/report/${encodeURIComponent(id)}`)
    .then<FetchMisconfig | BackendError>(res => res.json())
    .then(data => {
      if ("errors" in data)
        return null
      const { data: { attributes } } = data
      return {
        ...attributes,
        id,
        provider: interpretProvider(attributes)
      }
    })
}

function interpretProvider(misconfig: MisconfigPreview) {
  return extractProvider(misconfig.type === "code"
    ? misconfig.patched_content
    : misconfig.command)
}
