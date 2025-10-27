import { GithubForm } from "@/app/ui/sources/github-form";
import { AwsForm } from "@/app/ui/sources/aws-form";

export default async function Page({ params }: { params: Promise<{ plugin: string }> }) {
  const { plugin } = await params;

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <p className="text-sm text-gray-600 italic mb-6 text-center">
        ⚠️ We strongly recommend that the access tokens or keys entered here are{" "}
        <span className="font-semibold">read-only</span>.
      </p>

      {plugin === "github" && <GithubForm />}
      {plugin === "aws" && <AwsForm />}
      {!["github", "aws"].includes(plugin) && (
        <p>Unsupported plugin: {plugin}</p>
      )}
    </div>
  );
}