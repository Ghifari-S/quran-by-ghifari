'use client';

import { useEffect, useState } from 'react';
import localFont from 'next/font/local';

const  lqmpFont = localFont({
  src: '../../../../../font/LPMQ IsepMisbah.ttf',
  variable: '--font-lpmq'
})
const SuratPage = ({ surat_id }: { surat_id: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?surat=${surat_id}&token=TADABBUR_EMAILKU`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surat_id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Loading...</p>
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <p>❌ Data tidak ditemukan</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Surah */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-100">
            📖 {data.data[0]?.surah.nama_latin}
          </h1>
          <p className="text-lg text-gray-400">
            Total Ayat: {data.data[0]?.surah.jumlah_ayat}
          </p>
        </div>

        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-gray-100"></p>
        </div>

        {/* Daftar Ayat */}
        <div className="space-y-4">
          {data.data.map((item: any) => (
            <div
              key={item.ayat.number.inQuran}
              className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg"
            >
              {/* Ayat dalam Bahasa Arab */}
              <p className={`text-right text-3xl font-semibold text-gray-100 leading-relaxed ${lqmpFont.className}`}>
                {item.ayat.arab}
              </p>

              {/* Latin & Terjemahan */}
              {/* <p className="text-sm italic text-gray-400 mt-2">
                {item.ayat.latin}
              </p> */}
              <p className="text-base text-gray-300 mt-2">
                {item.ayat.translation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuratPage;
