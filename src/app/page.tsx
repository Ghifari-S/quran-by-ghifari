"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import localFont from "next/font/local";

const lpmqFont = localFont({
  src: "../../font/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      "https://quran.ppqita.my.id/api/quran?listSurah=true&token=TADABBUR_EMAILKU"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data");
        }
        return response.json();
      })
      .then((data) => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 items-center ">
      <div className="text-center ">
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}
      </div>

      {!loading && !error && (
        <div className="w-full">
          <header className="w-full bg-gray-800 shadow-md mb-8">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
              {/* Logo atau Nama Aplikasi */}
              <div className="text-2xl font-bold text-white">
                📖 Tadabbur Quran
              </div>

              {/* Menu Navigasi */}
              <nav className="flex space-x-6">
                <Link
                  href="/setoran/input-nama-santri"
                  className="text-gray-300 hover:text-white transition"
                >
                  Tambah Santri
                </Link>
                <Link
                  href="/sholat"
                  className="text-gray-300 hover:text-white transition"
                >
                  Jadwal Sholat
                </Link>
                <Link
                  href="/juz"
                  className="text-gray-300 hover:text-white transition"
                >
                  Pilih Juz
                </Link>
                <Link
                  href="/pilih-surat"
                  className="text-gray-300 hover:text-white transition"
                >
                  Pilih Surat
                </Link>
                <Link
                  href="/tentang-kami"
                  className="text-gray-300 hover:text-white transition"
                >
                  Tentang Kami
                </Link>
              </nav>
            </div>
          </header>
          <h1 className="text-3xl font-bold mb-6 text-center">
            📖 Daftar Surah
          </h1>
          <div className="flex flex-col items-center p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl ">
              {surahs.map((surah) => (
                <Link href={`surat/${surah.nomor}`} key={surah.nomor}>
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition cursor-pointer">
                    <div className="flex flex-row items-center gap-2 mt-2">
                      <span className="text-xl font-bold block">
                        {surah.nomor}.
                      </span>
                      <span
                        className={`text-xl font-bold block ${lpmqFont.className}`}
                      >
                        {surah.nama}
                      </span>
                    </div>
                    <span className="text-lg text-gray-300 block">
                      {surah.nama_latin}
                    </span>
                    <span className="text-md text-gray-400">{surah.arti}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
