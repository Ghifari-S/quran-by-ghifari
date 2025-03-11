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
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://quran.ppqita.my.id/api/quran?listSurah=true&token=TADABBUR_EMAILKU'
    )
      .then((response) => response.json())
      .then((data) => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Surah</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-5">
          {surahs.map((surah) => (
            <li key={surah.nomor} className="mb-2">
              <span className="font-semibold">{surah.nama_latin}</span> -{' '}
              {surah.arti} ({surah.jumlah_ayat} ayat)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}