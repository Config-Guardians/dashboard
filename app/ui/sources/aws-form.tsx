"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AwsForm() {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const body = {
        data: {
          configuration: `connection "aws" {
plugin = "aws"
access_key = "${accessKey}"
secret_key = "${secretKey}"
}`,
          plugin: "aws",
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
      console.error("Failed to connect AWS plugin:", err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Add AWS Plugin
      </h2>

      <label className="block">
        <span className="text-gray-700">AWS Access Key</span>
        <input
          type="text"
          className="border rounded p-2 w-full mt-1"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          placeholder="AKIA..."
          required
        />
      </label>

      <label className="block">
        <span className="text-gray-700">AWS Secret Key</span>
        <input
          type="password"
          className="border rounded p-2 w-full mt-1"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Your AWS secret key"
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
        {status === "loading" ? "Connecting..." : "Connect to AWS"}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm">
          ✅ Successfully connected! Redirecting...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm">
          ❌ Failed to connect. Check your credentials.
        </p>
      )}
    </form>
  );
}
