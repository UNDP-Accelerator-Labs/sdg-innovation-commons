import Link from 'next/link';

export default function Index() {
  return (
    <div className="mb-[10px] rounded-md bg-gray-200 p-[10px] font-space-mono">
      <p className="text-sm">
        Some content may be restricted. Please{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          log in
        </Link>{' '}
        to access all features.
      </p>
    </div>
  );
}
