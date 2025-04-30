"use client";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const lpmqFont = localFont({
  src: "../../../../../font/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

const QuranJuz = ({ juz_id }: { juz_id: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?juz=${juz_id}&token=TADABBUR_EMAILKU`
        );
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [juz_id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6">
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!loading && !error && data && (
        <div className="w-full max-w-4xl">
          <div className="space-y-4">
            {data.data.map((item: any) => (
              <div
                key={item.ayat.number.inQuran}
                className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition"
              >
                {item.ayat.number.inSurah == 1 && (
                  <div className="m-8 text-center font-bold text-2xl">
                    {item.surah.nama_latin}
                    <div className="text-cent pt-2 text-lg">
                      Total Ayat: {data.data[0]?.surah.jumlah_ayat}
                    </div>
                  </div>
                )}

                {item.ayat.number.inSurah == 1 &&
                  item.surah.nomor != 1 &&
                  item.surah.nomor != 9 && (
                    <div
                      className={`${lpmqFont.className} flex justify-center font-bold pb-7 text-3xl`}
                    >
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </div>
                  )}
                <p
                  className={`text-2xl text-right font-bold mb-2 ${lpmqFont.className}`}
                >
                  {item.ayat.arab}
                </p>
                <p className="text-sm italic text-gray-300 mb-1">
                  {item.ayat.latin}
                </p>
                <p className="text-base text-gray-200">
                  {item.ayat.number.inSurah}. {item.ayat.translation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranJuz;
