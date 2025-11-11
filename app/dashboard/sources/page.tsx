import Image from "next/image";
import Link from "next/link";
import { pluginFields } from "./[plugin]/plugins";

const providers = Object.keys(pluginFields);

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex grow items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Connect a Source
          </h1>

          <div className="flex flex-wrap gap-8 justify-center">
            {providers.map(name => (
              <Link
                key={name.toLowerCase()}
                href={`/dashboard/sources/${name}`}
                className="group flex flex-col items-center justify-center w-64 h-64 bg-white border rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 p-6"
              >
                <Image
                  src={`/providers/${name.toLowerCase()}.png`}
                  width={100}
                  height={100}
                  alt={name}
                  className="object-contain mb-4 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
