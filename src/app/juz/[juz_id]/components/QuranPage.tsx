'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SuratPage = ({ surat_id }: { surat_id: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?page=${surat_id}&token=TADABBUR_EMAILKU`
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

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Surah {data.data[0]?.surah.nama_latin}
      </h1>
      <p className="text-lg">Total Ayat: {data.data[0]?.surah.jumlah_ayat}</p>
      <div className="mt-4 space-y-4">
        {data.data.map((item: any) => (
          <div
            key={item.ayat.number.inQuran}
            className="border p-4 rounded-lg shadow"
          >
            <p className="text-right text-2xl font-arabic">{item.ayat.arab}</p>
            <p className="text-sm italic">{item.ayat.latin}</p>
            <p className="text-base">{item.ayat.translation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuratPage;
