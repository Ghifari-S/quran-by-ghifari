"use client";

import { useRouter } from "next/navigation";

export default function JuzListPage() {
  const router = useRouter();

  const handleClick = (juzNumber: number) => {
    router.push(`/juz/${juzNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Daftar Juz</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 30 }, (_, i) => {
            const juzNumber = i + 1;
            return (
              <button
                key={juzNumber}
                onClick={() => handleClick(juzNumber)}
                className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-6 text-center shadow-md"
              >
                <p className="text-lg font-semibold">Juz {juzNumber}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
