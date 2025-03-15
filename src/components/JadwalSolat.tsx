'use client';

import React, { useState, useEffect } from 'react';
import {
  PRAYER_NAMES,
  getPrayerTimes,
  formatPrayerTime,
  getCurrentPrayer,
  formatCurrentDate,
  formatCurrentTime,
} from '@/lib/prayer-times';

interface PrayerTimesProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

export default function PrayerTimes({
  latitude,
  longitude,
  locationName = 'Lokasi Anda',
}: PrayerTimesProps) {
  const [currentTime, setCurrentTime] = useState<string>(formatCurrentTime());
  const [prayerTimes, setPrayerTimes] = useState<Record<string, Date>>({});
  const [currentPrayer, setCurrentPrayer] = useState<{
    current: { name: string; time: Date } | null;
    next: { name: string; time: Date };
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Calculate time remaining until next prayer
  const calculateTimeRemaining = (nextPrayerTime: Date) => {
    const now = new Date();
    const diff = nextPrayerTime.getTime() - now.getTime();

    if (diff <= 0) return '00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Initialize prayer times
    const times = getPrayerTimes(latitude, longitude);
    setPrayerTimes(times);
    const prayer = getCurrentPrayer(times);
    setCurrentPrayer(prayer);

    // Update every second
    const timer = setInterval(() => {
      setCurrentTime(formatCurrentTime());

      // Refresh prayer times at midnight
      const now = new Date();
      if (
        now.getHours() === 0 &&
        now.getMinutes() === 0 &&
        now.getSeconds() === 0
      ) {
        const newTimes = getPrayerTimes(latitude, longitude);
        setPrayerTimes(newTimes);
        setCurrentPrayer(getCurrentPrayer(newTimes));
      } else {
        // Update current prayer status
        setCurrentPrayer(getCurrentPrayer(times));
      }

      // Update countdown
      if (prayer) {
        setTimeRemaining(calculateTimeRemaining(prayer.next.time));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [latitude, longitude]);

  const prayerList = Object.entries(PRAYER_NAMES).map(([key, name]) => ({
    key,
    name,
    time: prayerTimes[key] ? formatPrayerTime(prayerTimes[key]) : '--:--',
    isCurrent: currentPrayer?.current?.name === name,
    isNext: currentPrayer?.next?.name === name,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{locationName}</h2>
        <p className="text-gray-600">{formatCurrentDate()}</p>
        <div className="text-3xl font-bold text-gray-800 my-2">
          {currentTime}
        </div>
      </div>

      {currentPrayer && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-emerald-800">Waktu salat berikutnya</p>
            <h3 className="text-2xl font-bold text-emerald-700">
              {currentPrayer.next.name}
            </h3>
            <div className="flex justify-center items-center gap-2">
              <span className="text-xl font-semibold text-emerald-700">
                {formatPrayerTime(currentPrayer.next.time)}
              </span>
              <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                {timeRemaining}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {prayerList.map((prayer) => (
          <div
            key={prayer.key}
            className={`flex justify-between py-3 px-2 ${
              prayer.isCurrent
                ? 'bg-blue-50 rounded'
                : prayer.isNext
                ? 'bg-emerald-50 rounded'
                : ''
            }`}
          >
            <span
              className={`font-medium ${
                prayer.isCurrent || prayer.isNext ? 'font-bold' : ''
              }`}
            >
              {prayer.name}
              {prayer.isCurrent && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Saat ini
                </span>
              )}
              {prayer.isNext && (
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                  Berikutnya
                </span>
              )}
            </span>
            <span className="font-mono">{prayer.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <div>
          Imsak:{' '}
          {prayerTimes.imsak ? formatPrayerTime(prayerTimes.imsak) : '--:--'}
        </div>
        <div className="flex justify-center gap-4 mt-1">
          <div>
            Tengah Malam:{' '}
            {prayerTimes.middleOfNight
              ? formatPrayerTime(prayerTimes.middleOfNight)
              : '--:--'}
          </div>
          <div>
            1/3 Malam Terakhir:{' '}
            {prayerTimes.lastThirdOfNight
              ? formatPrayerTime(prayerTimes.lastThirdOfNight)
              : '--:--'}
          </div>
        </div>
      </div>
    </div>
  );
}
