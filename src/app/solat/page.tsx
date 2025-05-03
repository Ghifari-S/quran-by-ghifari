"use client";

import PrayerTimes from "@/components/PrayerTimes";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [coordinates, setCoordinates] = useState({
    latitude: -6.2088,
    longitude: 106.8456,
  }); // Default: Jakarta

  useEffect(() => {
    // Dapatkan lokasi pengguna jika diizinkan
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <div>
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
              href="/tentang-kami"
              className="text-gray-300 hover:text-white transition"
            >
              Tentang Kami
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Jadwal Waktu Salat
        </h1>
        <PrayerTimes
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          locationName="Lokasi Saat Ini"
        />
      </main>
    </div>
  );
}
