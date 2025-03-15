'use client';

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
  console.log('run home');

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://quran.ppqita.my.id/api/quran?listSurah=true&token=TADABBUR_EMAILKU'
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('isi result adalah: ', result);
        setSurahs(result.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📖 Daftar Surah</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surahs.map((surah) => (
            <div
              key={surah.nomor}
              className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700"
            >
              <h2 className="text-xl font-semibold">{surah.nama_latin} ({surah.nama})</h2>
              <p className="text-gray-400 italic">{surah.arti}</p>
              <p className="mt-2 text-gray-300">📜 {surah.jumlah_ayat} Ayat</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
