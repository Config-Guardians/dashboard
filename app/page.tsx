import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 md:flex-row md:justify-between">
      {/* Left side: text + button */}
      <div className="flex flex-col items-start gap-6 rounded-lg bg-white px-6 py-10 md:w-2/5 md:px-12">
        <h1 className={`${lusitana.className} text-4xl font-bold text-gray-800`}>
          Welcome
        </h1>
        <p className="text-gray-600 text-center md:text-left">
          Click here to start securing your configurations!
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Enter</span>
          <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
      </div>

      {/* Right side: image */}
      <div className="mt-8 flex justify-center md:mt-0 md:w-3/5">
        <Image
          src="/placeholder.png"
          width={600}
          height={400}
          alt="Placeholder"
          className="hidden md:block rounded-lg shadow-lg"
        />
      </div>
    </main>
  );
}
