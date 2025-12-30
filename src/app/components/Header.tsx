'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          📰 Newspaper Subscriptions
        </Link>
      </div>
    </header>
  );
}
