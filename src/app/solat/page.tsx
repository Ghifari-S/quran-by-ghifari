"use client";

import PrayerTimes from "@/components/PrayerTimes";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation-menu";

export default function Home() {
  const [coordinates, setCoordinates] = useState({
    latitude: -6.2088,
    longitude: 106.8456,
  }); // Default: Jakarta

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Jadwal Waktu Salat
        </h1>
        <div className="flex justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <PrayerTimes
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              locationName="Lokasi Saat Ini"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
