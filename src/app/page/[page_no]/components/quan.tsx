'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local';
import { addData, getDataById } from '@/lib/db-api';

const lpmqFont = localFont({
  src: '../../../../fonts/LPMQ.ttf',
  variable: '--font-lpmq',
});

// Struktur untuk Surah
interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
}

// Struktur untuk Ayat
interface Ayat {
  number: {
    inQuran: number;
    inSurah: number;
  };
  arab: string;
  translation: string;
  meta: {
    juz: number;
    page: number;
    manzil: number;
    ruku: number;
    hizbQuarter: number;
    sajda: {
      recommended: boolean;
      obligatory: boolean;
    };
  };
  latin: string;
}

// Data JSON yang akan diproses
interface ApiResponse {
  status: string;
  data: {
    surah: Surah;
    ayat: Ayat;
  }[];
}

// Menggunakan Record untuk menyimpan mapping
type MapSurat = Record<string, Surah>;
type MapAyat = Record<string, Ayat[]>;

// Inisialisasi Record
const mapSurat: MapSurat = {};
const mapAyat: MapAyat = {};

const SuratPage = ({ page_no }: { page_no: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapAyatUpdate, setMapAyatUpdate] = useState<MapAyat>({});
  const [mapSuratUpdate, setMapSuratUpdate] = useState<MapSurat>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data di indexdb
        let result = await getDataById(page_no);

        if (!result || !result.data) {
          // jika tidak ada, maka mengambil data quran dari api
          const response = await fetch(
            `https://quran.ppqita.my.id/api/quran?mushafPage=${page_no}&token=TADABBUR_EMAILKU`
          );
          const resData: ApiResponse = await response.json();
          result = { id: page_no, data: resData.data };

          // simpan data di indexdb
          await addData(result);
        }

        console.log('result: ', result.data);

        result.data.forEach(({ surah, ayat }: { surah: Surah; ayat: Ayat }) => {
          const surahName = surah.nama_latin; // Misalnya: "An-Naba'", "An-Nas"

          // Simpan data surat jika belum ada
          if (!mapSurat[surahName]) {
            mapSurat[surahName] = surah;
          }

          // Simpan data ayat berdasarkan nama surat
          if (!mapAyat[surahName]) {
            mapAyat[surahName] = [];
          }
          mapAyat[surahName].push(ayat);
        });
        setData(result);
        setMapAyatUpdate(mapAyat);
        setMapSuratUpdate(mapSurat);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page_no]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  return (
    <div className="p-8">
      {Object.entries(mapSuratUpdate).map(([slug, surah]) => (
        <li key={slug} className="border p-3 rounded shadow">
          {surah.nomor}. {surah.nama_latin}
          <div>
            {mapAyatUpdate[slug].map((ayat: Ayat) => {
              return (
                <div key={ayat.number.inQuran}>
                  {ayat.number.inSurah === 1 && <div>Bismillah</div>}
                  <div className={`${lpmqFont.className}`}>
                    ({ayat.number.inSurah}) {ayat.arab}
                  </div>
                </div>
              );
            })}
          </div>
        </li>
      ))}
    </div>
  );
};

export default SuratPage;
