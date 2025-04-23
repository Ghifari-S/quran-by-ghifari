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
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">📖 Daftar Surah</h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {surahs.map((surah) => (
            <Link href={`surat/${surah.nomor}`} key={surah.nomor}>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition cursor-pointer">
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
      )}
    </div>
  );
}
