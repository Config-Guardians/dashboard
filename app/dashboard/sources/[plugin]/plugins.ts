export const pluginFields: Record<string, Record<"name" | "placeholder" | "description", string>[]> = {
  GitHub: [{
    name: "token",
    placeholder: "github_pat_...",
    description: "GitHub Personal Access Token"
  }],
  AWS: [{
    name: "access_key",
    placeholder: "AKIA...",
    description: "AWS Access Key"
  },
  {
    name: "secret_key",
    placeholder: "Your AWS secret key",
    description: "AWS Secret Key"
  }
  ]
} as const
