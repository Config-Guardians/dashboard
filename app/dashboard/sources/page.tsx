import Image from "next/image";
import Link from "next/link";

const providers = [
  {
    name: "GitHub",
    key: "github",
    href: "/dashboard/sources/github",
  },
  {
    name: "AWS",
    key: "aws",
    href: "/dashboard/sources/aws",
  },
];

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex grow items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Connect a Source
          </h1>

          <div className="flex flex-wrap gap-8 justify-center">
            {providers.map((provider) => (
              <Link
                key={provider.key}
                href={provider.href}
                className="group flex flex-col items-center justify-center w-64 h-64 bg-white border rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 p-6"
              >
                <Image
                  src={`/providers/${provider.key}.png`}
                  width={100}
                  height={100}
                  alt={provider.name}
                  className="object-contain mb-4 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                  {provider.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
