"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { addData, getDataById } from "@/lib/db-api";

const lpmqFont = localFont({
  src: "../../../../../font/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
}

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

interface ApiResponse {
  status: string;
  data: {
    surah: Surah;
    ayat: Ayat;
  }[];
}

type MapSurat = Record<string, Surah>;
type MapAyat = Record<string, Ayat[]>;

const mapSurat: MapSurat = {};
const mapAyat: MapAyat = {};

const SuratPage = ({ surat_id }: { surat_id: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapSuratUpdate, setMapSuratUpdate] = useState<MapSurat>({});
  const [mapAyatUpdate, setMapAyatUpdate] = useState<MapAyat>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getDataById(surat_id);

        if (!result || !result.data) {
          const response = await fetch(
            `https://quran.ppqita.my.id/api/quran?mushafPage=${surat_id}&token=TADABBUR_EMAILKU`
          );
          const resData: ApiResponse = await response.json();
          result = { id: surat_id, data: resData.data };

          // await addData(result); // kalau mau simpan
        }

        result.data.forEach(({ surah, ayat }: { surah: Surah; ayat: Ayat }) => {
          const surahName = surah.nama_latin;

          if (!mapSurat[surahName]) {
            mapSurat[surahName] = surah;
          }

          if (!mapAyat[surahName]) {
            mapAyat[surahName] = [];
          }
          mapAyat[surahName].push(ayat);
        });

        setData(result);
        setMapSuratUpdate({ ...mapSurat });
        setMapAyatUpdate({ ...mapAyat });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surat_id]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6">
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!loading && !error && data && (
        <div className="w-full max-w-4xl space-y-6">
          {Object.entries(mapSuratUpdate).map(([slug, surah]) => (
            <div
              key={slug}
              className="bg-gray-800 p-6 rounded-lg shadow-lg "
            >
              <h1 className="text-3xl font-bold mb-2 text-center">
                📖 Surah {surah.nama_latin}
              </h1>
              <p className="text-center text-gray-400 mb-6">
                Total Ayat: {surah.jumlah_ayat}
              </p>

              <div className="space-y-4">
                {mapAyatUpdate[slug].map((ayat) => (
                  <div
                    key={ayat.number.inQuran}
                    className="bg-gray-700 p-4 rounded-lg"
                  >
                    <p
                      className={`text-2xl text-right font-bold mb-2 ${lpmqFont.className}`}
                    >
                      {ayat.arab}
                    </p>
                    <p className="text-sm italic text-gray-300 mb-1">
                      {ayat.latin}
                    </p>
                    <p className="text-base text-gray-200">
                      {ayat.translation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuratPage;
