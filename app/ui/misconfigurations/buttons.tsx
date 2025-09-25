import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
// import { deleteMisconfig } from '@/app/lib/actions';

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

// just routes back to /dashboard/misconfigurations for now, probably no need to delete miscconfigs
export function DeleteMisconfig({ id }: {id: string}) {
  return (
    <Link
      href="/dashboard/misconfigurations"
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-4" />
    </Link>
  );
}