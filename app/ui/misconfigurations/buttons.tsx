import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function ViewMisconfig({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/misconfigurations/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <MagnifyingGlassIcon className="w-5" />
    </Link>
  );
}