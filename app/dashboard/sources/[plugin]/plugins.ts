export const pluginFields: Record<string, Record<"name" | "placeholder" | "description" | "type", string>[]> = {
  GitHub: [
    {
      name: "token",
      placeholder: "github_pat_...",
      description: "GitHub Personal Access Token",
      type: "password"
    }
  ],
  AWS: [
    {
      name: "access_key",
      placeholder: "AKIA...",
      description: "AWS Access Key",
      type: "password"
    },
    {
      name: "secret_key",
      placeholder: "Your AWS secret key",
      description: "AWS Secret Key",
      type: "password"
    },
    {
      name: "default_region",
      placeholder: "ap-southeast-1...",
      description: "AWS region",
      type: "text"
    }
  ]
} as const
