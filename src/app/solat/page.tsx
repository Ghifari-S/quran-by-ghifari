"use client";

import PrayerTimes from "@/components/PrayerTimes";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation-menu";

export default function Home() {
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null); // null artinya belum dapat lokasi

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi delay awal (efek loading saat halaman dibuka)
    const timeout = setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLoading(false);
          },
          (error) => {
            console.error("Gagal mengambil lokasi:", error.message);
            // fallback ke Jakarta
            setCoordinates({
              latitude: -6.2088,
              longitude: 106.8456,
            });
            setLoading(false);
          }
        );
      } else {
        setCoordinates({
          latitude: -6.2088,
          longitude: 106.8456,
        });
        setLoading(false);
      }
    }, 1500); // delay 1.5 detik

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="w-full bg-gray-800 shadow-md mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="text-2xl font-bold text-white">📖 Tadabbur Quran</div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white">
              Beranda
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white">
              Tentang Kami
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Jadwal Waktu Salat
        </h1>

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
              <PrayerTimes
                latitude={coordinates!.latitude}
                longitude={coordinates!.longitude}
                locationName="Lokasi Saat Ini"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
