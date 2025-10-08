import { lusitana } from "@/app/ui/fonts"
import { ReactNode } from "react"

export default async function Page({ children }: { children: ReactNode }) {
  return <>
    <div className="flex w-full items-center justify-between">
      <h1 className={`${lusitana.className} text-2xl`}>Misconfigurations</h1>
    </div>
    {children}
  </>
}
