'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      'https://quran.ppqita.my.id/api/quran?listSurah=true&token=TADABBUR_EMAILKU'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil data');
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
      {surahs.map((surah) => (
        <Link href={`surat/${surah.nomor}`} key={surah.nomor}>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold text-white">{surah.nama}</h3>
                <p className="text-lg text-gray-200">{surah.nama_latin}</p>
              </div>
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                {surah.nomor}
              </span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-700">
              <p className="text-gray-300">
                {surah.arti} 
                <span className="text-gray-400 text-sm ml-2">
                  • {surah.jumlah_ayat} ayat
                </span>
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {surah.tempat_turun === 'mekah' ? 'Makkiyah' : 'Madaniyah'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
      )}
    </div>
  );
}
