"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { addData, getDataById } from "@/lib/db-api";

const lpmqFont = localFont({
  src: "../../../../../../font/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

// struktur untuk surah
interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
}

// struktur untuk ayat
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

// Inisialisasi Record
const mapSurat: MapSurat = {};
const mapAyat: MapAyat = {};

// array angka arab
const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// array angka terjemahan


// fungsi convert angka biasa ke angka arab
function toArabicNumber(num: number) {
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumbers[parseInt(digit)])
    .join("");
}

const SuratPage = ({ surat_id }: { surat_id: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(` info ${surat_id}`);
    const fetchData = async () => {
      try {
        let result = await getDataById(surat_id);

        if (!result || !result.data) {
          const response = await fetch(
            `https://quran.ppqita.my.id/api/quran?mushafPage=${surat_id}&token=TADABBUR_EMAILKU`
          );
          const resData: ApiResponse = await response.json();
          result = { id: surat_id, data: resData.data };

          // simpan data di indexdb
          // await addData(result);
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
        <div className="w-full max-w-4xl space-y-8">
          {/* Loop per Surat */}
          {Object.entries(mapSurat).map(([slug, surah]) => (
            <div key={slug} className="w-full">
              <h1 className="text-3xl font-bold mb-2 text-center">
                📖 Surah {surah.nama_latin}
              </h1>
              <p className="text-center text-gray-400 mb-6">
                Total Ayat: {surah.jumlah_ayat}
              </p>

              {/* Loop per Ayat */}
              <div className="space-y-4">
                {mapAyat[slug].map((ayat) => (
                  <div
                    key={ayat.number.inQuran}
                    className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition"
                  >
                    {ayat.number.inSurah == 1 && (<div> bismillah</div>)}
                    <p className={`text-2xl text-right font-bold mb-2 ${lpmqFont.className}`}>
                      <span className="leading-14">{ayat.arab}</span>
                      <span className="inline items-center justify-center w-6 h-6 mr-3 border-gray-400">
                        {toArabicNumber(ayat.number.inSurah)}
                      </span>
                      
                    </p>
                    {/* <p className="text-sm italic text-gray-300 mb-1">
                      {ayat.latin}
                    </p> */}
                    <p className="text-base text-gray-200">
                      <span>{ayat.number.inSurah}. </span>
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
