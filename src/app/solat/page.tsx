'use client';

import PrayerTimes from '@/components/PrayerTimes';
import { useState, useEffect } from 'react';

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
  );
}
