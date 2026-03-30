'use client';

import Link from 'next/link';

export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Akses Ditolak</h1>
        <p className="mb-6">
          Anda harus login terlebih dahulu untuk mengakses halaman ini.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}
