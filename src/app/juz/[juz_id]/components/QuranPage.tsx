"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";

const lpmqFont = localFont({
  src: "../../../../../font/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

interface Ayah {
  number: number;
  text: string;
  latin: string;
  translation: string;
  surah: {
    number: number;
    name: string;
  };
}

interface JuzData {
  juz: number;
  ayahs: Ayah[];
}

interface QuranPageProps {
  juz_id: string;
}

export default function QuranPage({ juz_id }: QuranPageProps) {
  const router = useRouter();
  const [juzData, setJuzData] = useState<JuzData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!juz_id) {
        setError("Parameter juz tidak valid");
        setLoading(false);
        return;
      }

      const juzNumber = parseInt(juz_id, 10);
      if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
        setError("Nomor juz harus antara 1-30");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://quran.ppqita.my.id/api/quran?juz=${juzNumber}&token=TADABBUR_EMAILKU`);
        if (!res.ok) throw new Error(`Gagal memuat data juz ${juzNumber}`);

        const result = await res.json();
        if (result.status !== "success" || !Array.isArray(result.data)) {
          throw new Error("Data tidak valid");
        }

        const ayahs = result.data.map((item: any) => ({
          number: item.ayat.number.inSurah,
          text: item.ayat.arab,
          latin: item.ayat.latin,
          translation: item.ayat.translation,
          surah: {
            number: item.surah.nomor,
            name: item.surah.nama_latin,
          },
        }));

        setJuzData({ juz: juzNumber, ayahs });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [juz_id]);

  const groupAyahsBySurah = (ayahs: Ayah[]) => {
    const grouped: { surah: { number: number; name: string }; ayahs: Ayah[] }[] = [];
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

  if (loading) return <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">Loading...</div>;
  if (error || !juzData)
    return <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">❌ {error || "Data tidak tersedia"}</div>;

  const surahGroups = groupAyahsBySurah(juzData.ayahs);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-center text-3xl font-bold">📖 Juz {juzData.juz}</h1>

        {surahGroups.map((group, i) => (
          <div key={i} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Surah {group.surah.name}</h2>
              {group.surah.number !== 9 && group.surah.number !== 1 && (
                <p className={`mt-3 text-2xl ${lpmqFont.className}`}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              )}
            </div>

            {group.ayahs.map((ayah, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md mb-2 hover:bg-gray-700 transition"
              >
                <p className={`text-2xl text-right font-bold leading-loose ${lpmqFont.className}`}>
                  {ayah.text}
                  <span className="inline-block text-base ml-2 border border-gray-400 px-2 rounded-full">
                    {ayah.number}
                  </span>
                </p>

                {!isReadingMode && (
                  <>
                    <p className="text-sm italic text-gray-300">{ayah.latin}</p>
                    <p className="text-base text-gray-200 mt-1">
                      <span>{ayah.number}. </span>
                      {ayah.translation}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
