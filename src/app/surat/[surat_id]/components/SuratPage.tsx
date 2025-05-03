"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import localFont from "next/font/local";

const lqmpFont = localFont({
  src: "../../../../../font/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

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
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?surat=${surat_id}&token=TADABBUR_EMAILKU`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("Gagal memuat data");
        console.error("Error fetching data:", error);
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

  if (error || !data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        ❌ {error || "Data tidak ditemukan"}
      </div>
    );

  const surat = data.data[0].surah; // Ambil info surat dari ayat pertama

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center ">
      <header className="w-full bg-gray-800 shadow-md mb-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo atau Nama Aplikasi */}
        <div className="text-2xl font-bold text-white">📖 Tadabbur Quran</div>

        {/* Menu Navigasi */}
        <nav className="flex space-x-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition"
          >
            Beranda
          </Link>
          <Link
            href="/solat"
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
      <div className="w-full max-w-4xl space-y-4">
        {/* HEADER SURAT */}
        <div className="text-center">
          <div className="text-2xl font-bold">{surat.nama_latin}</div>
          <div className="text-lg mt-1">Total Ayat: {surat.jumlah_ayat}</div>
        </div>

        {/* BISMILLAH */}
        {surat.nomor !== 1 && surat.nomor !== 9 && (
          <div
            className={`${lqmpFont.className} flex justify-center font-bold text-3xl pb-7 pt-5`}
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>
        )}

        {/* AYAT-AYAT */}
        {data.data.map((item: any) => (
          <div
            key={item.ayat.number.inQuran}
            className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            <p
              className={`text-2xl text-right font-bold mb-5 leading-16 ${lqmpFont.className}`}
            >
              {item.ayat.arab}
              <span className="mr-3 text-2xl text-white">
                ۝{toArabicNumber(item.ayat.number.inSurah)}
              </span>
            </p>

            <p className="text-base text-gray-200 pb-4">
              {item.ayat.number.inSurah}. {item.ayat.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuratPage;
