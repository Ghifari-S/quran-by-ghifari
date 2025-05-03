"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { addData, getDataById } from "@/lib/db-api";
import Link from "next/link";

const lpmqFont = localFont({
  src: "../../../../../font/LPMQ IsepMisbah.ttf",
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
  text: string;
  surah: {
    number: number;
    name: string;
  };
}

interface pageData {
  page: number;
  ayats: Ayat[];
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

// array angka terjemahan

// fungsi convert angka biasa ke angka arab

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
    function toArabicNumber(num: number): string {
      const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
      return num
        .toString()
        .split("")
        .map((d) => arabicDigits[parseInt(d)])
        .join("");
    }

    const groupAyahsBySurah = (ayahs: Ayat[]) => {
      const grouped: {
        surah: { number: number; name: string };
        ayahs: Ayat[];
      }[] = [];
      let currentSurah = null;

      for (const ayah of ayahs) {
        if (!currentSurah || currentSurah.number !== ayah.surah.number) {
          currentSurah = ayah.surah;
          grouped.push({ surah: currentSurah, ayahs: [ayah] });
        } else {
          grouped[grouped.length - 1].ayahs.push(ayah);
        }
      }

      return grouped;
    };
  }, [surat_id]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center ">
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!loading && !error && data && (
        <div className="w-full flex flex-col items-center">
          <header className="w-full bg-gray-800 shadow-md mb-8">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
              {/* Logo atau Nama Aplikasi */}
              <div className="text-2xl font-bold text-white">
                📖 Tadabbur Quran
              </div>

              {/* Menu Navigasi */}
              <nav className="flex space-x-6">
                <Link
                  href="/setoran/input-nama-santri"
                  className="text-gray-300 hover:text-white transition"
                >
                  Tambah Santri
                </Link>
                <Link
                  href="/sholat"
                  className="text-gray-300 hover:text-white transition"
                >
                  Jadwal Sholat
                </Link>
                <Link
                  href="/juz"
                  className="text-gray-300 hover:text-white transition"
                >
                  Pilih Juz
                </Link>
                <Link
                  href="/pilih-surat"
                  className="text-gray-300 hover:text-white transition"
                >
                  Pilih Surat
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
                    className={`text-2xl text-right font-bold mb-2 ${lpmqFont.className}`}
                  >
                    {item.ayat.arab}
                  </p>
                  {/* <p className="text-sm italic text-gray-300 mb-1">
                    {item.ayat.latin}
                  </p> */}
                  <p className="text-base text-gray-200">
                    <span>{item.ayat.number.inSurah}. </span>
                    {item.ayat.translation}
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
