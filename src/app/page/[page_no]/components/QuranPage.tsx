"use client";

import { openDB, IDBPDatabase } from "idb";
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { addData, getDataById } from "@/lib/db-api";
import Link from "next/link";

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
  text: string;
  surah: {
    number: number;
    name: string;
  };
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

// 🔢 Fungsi konversi angka ke angka Arab
const toArabicNumber = (num: number): string => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicDigits[parseInt(d)])
    .join("");
};

const SuratPage = ({ surat_id }: { surat_id: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center ">
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!loading && !error && data && (
        <div className="w-full flex flex-col items-center">
          <header className="w-full bg-gray-800 shadow-md mb-8">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
              <div className="text-2xl font-bold text-white">
                📖 Tadabbur Quran
              </div>

              <nav className="flex space-x-6">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition"
                >
                  Beranda
                </Link>
                <Link
                  href="/sholat"
                  className="text-gray-300 hover:text-white transition"
                >
                  Jadwal Sholat
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

          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-2 text-center">
              📖 Surah {data.data[0]?.surah.nama_latin}
            </h1>
            <p className="text-center text-gray-400 mb-6">
              Total Ayat: {data.data[0]?.surah.jumlah_ayat}
            </p>

            <div className="space-y-4">
              {data.data.map((item: { surah: Surah; ayat: Ayat }) => (
                <div
                  key={item.ayat.number.inQuran}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition"
                >
                  <p
                    className={`text-2xl text-right font-bold mb-2 leading-loose ${lpmqFont.className}`}
                  >
                    {item.ayat.arab}
                    <span className="mr-3 text-2xl text-white">
                      ۝{toArabicNumber(item.ayat.number.inSurah)}
                    </span>
                  </p>
                  <p className="text-base text-gray-200">
                    {item.ayat.number.inSurah}. {item.ayat.translation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratPage;
