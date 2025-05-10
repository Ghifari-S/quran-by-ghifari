"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const santri = searchParams.get("santri");

  const totalpage = 604;
  const halamanarray = Array.from({ length: totalpage }, (_, i) => i + 1);

  return (
    <div>
      {/* Header Navigasi */}
      <header className="w-full bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="text-2xl font-bold text-white">📖 Tadabbur Quran</div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Beranda
            </Link>
            <Link href="/setoran/input-nama-santri" className="text-gray-300 hover:text-white transition">
              Pilih Santri
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">
              Tentang Kami
            </Link>
          </nav>
        </div>
      </header>

      {/* Konten Utama */}
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Pilih Halaman Mushaf</h1>
          {santri && (
            <p className="text-center text-gray-300 mb-6">
              Untuk Santri: <span className="font-semibold">{santri}</span>
            </p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {halamanarray.map((hal) => (
              <Link
                key={hal}
                href={`/setoran/halaman-setoran/${hal}?santri=${santri ?? ""}`}
                className="bg-gray-800 hover:bg-blue-600 transition rounded-xl p-4 text-center shadow-md font-semibold"
              >
                {hal}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
