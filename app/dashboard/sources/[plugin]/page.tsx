"use client"

import Form from "next/form";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { pluginFields } from "./plugins";

const NEXT_PUBLIC_HACHIWARE_URL = process.env.NEXT_PUBLIC_HACHIWARE_URL

export default function Page({ params }: PageProps<"/dashboard/sources/[plugin]">) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const router = useRouter();
  const { plugin } = use(params);

  async function handleSubmit(formData: FormData) {
    setStatus("loading")

    const lowercasePlugin = plugin.toLowerCase();
    const data = formData.entries().map(([k, v]) => `${k}="${v}"`).toArray().join("\n");
    const res = await fetch(`${NEXT_PUBLIC_HACHIWARE_URL}/plugin`, {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          configuration: `connection "${lowercasePlugin}" {
plugin = "${lowercasePlugin}"
${data}
}`,
          plugin: lowercasePlugin,
        },
      }),
    });

    if (!res.ok) throw new Error(`Failed ${res.status}`)

    setStatus("success")
    router.push("/dashboard/sources");
  }

  return <Form action={handleSubmit} className="space-y-6 max-w-md mx-auto">
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
      Add {plugin} Plugin
    </h2>

    {
      pluginFields[plugin].map(({ name, placeholder, description, type, defaultValue }, key) =>
        <label className="block" key={key}>
          <span className="text-gray-700">{description}</span>
          <input
            type={type || "password"}
            className="border rounded p-2 w-full mt-1"
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue || ""}
            required
          />
        </label>
      )
    }

    <button
      disabled={status === "loading"}
      className={`px-4 py-2 rounded text-white ${status === "loading"
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
        }`}
      type="submit"
    >
      {status === "loading" ? "Connecting..." : `Connect to ${plugin}`}
    </button>

    {status === "success" && (
      <p className="text-green-600 text-sm">
        ✅ Successfully connected! Redirecting...
      </p>
    )}
    {status === "error" && (
      <p className="text-red-600 text-sm">
        ❌ Failed to connect. Check your token.
      </p>
    )}
  </Form>
}
