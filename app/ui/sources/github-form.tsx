"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GithubForm() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const body = {
        data: {
          configuration: `connection "github" {
plugin = "github"
token = "${token}"
}`,
          plugin: "github",
        },
      };

      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      setStatus("success");
      router.push("/dashboard/sources");
    } catch (err) {
      console.error("Failed to connect GitHub plugin:", err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Add GitHub Plugin
      </h2>

      <label className="block">
        <span className="text-gray-700">GitHub Personal Access Token</span>
        <input
          type="password"
          className="border rounded p-2 w-full mt-1"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_..."
          required
        />
      </label>

      <button
        disabled={status === "loading"}
        className={`rounded-md px-4 py-2 rounded text-white ${
          status === "loading"
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        type="submit"
      >
        {status === "loading" ? "Connecting..." : "Connect to GitHub"}
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
    </form>
  );
}
