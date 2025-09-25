import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    notFound();
}