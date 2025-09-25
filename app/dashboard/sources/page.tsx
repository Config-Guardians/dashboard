import Image from "next/image";

export default function SourcesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex grow items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Sources Placeholder
          </h1>
          <Image
            src="/love_zachary.png"
            width={600}
            height={400}
            alt="Sources placeholder"
            className="rounded-lg shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}
