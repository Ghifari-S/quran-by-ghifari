import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from 'adhan';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Prayer names in Indonesian
export const PRAYER_NAMES = {
  fajr: 'Subuh',
  sunrise: 'Terbit',
  dhuhr: 'Dzuhur',
  asr: 'Ashar',
  maghrib: 'Maghrib',
  isha: 'Isya',
};

export type PrayerName = keyof typeof PRAYER_NAMES;

/**
 * Get prayer times for a specific location and date
 */
export function getPrayerTimes(latitude: number, longitude: number, date: Date = new Date()) {
  // Set coordinates
  const coordinates = new Coordinates(latitude, longitude);

  // Use Indonesia calculation parameters
  // Indonesia follows the Ministry of Religious Affairs of Indonesia (Kementerian Agama RI)
  const params = CalculationMethod.MoonsightingCommittee();
  params.adjustments.fajr = -6; // Adjust Fajr angle to 20 degrees
  params.adjustments.isha = -2; // Adjust Isha angle to 18 degrees
  params.adjustments.dhuhr = -5;
  params.adjustments.maghrib = -3;
  // Calculate prayer times
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  return {
    imsak: new Date(prayerTimes.fajr.getTime() - 600000),
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
    middleOfNight: sunnahTimes.middleOfTheNight,
    lastThirdOfNight: sunnahTimes.lastThirdOfTheNight,
  };
}

/**
 * Format prayer time
 */
export function formatPrayerTime(time: Date): string {
  return format(time, 'HH:mm');
}

/**
 * Get the current or next prayer time
 */
export function getCurrentPrayer(prayerTimes: Record<string, Date>): {
  current: { name: string; time: Date } | null;
  next: { name: string; time: Date };
} {
  const now = new Date();
  const prayers = Object.entries(prayerTimes)
    .filter(([name]) => Object.keys(PRAYER_NAMES).includes(name))
    .sort((a, b) => a[1].getTime() - b[1].getTime());

  // Find the next prayer
  const nextPrayerIndex = prayers.findIndex(([_, time]) => time > now);

  if (nextPrayerIndex === -1) {
    // If all prayers have passed, the next prayer is the first prayer of the next day
    return {
      current: null,
      next: {
        name: PRAYER_NAMES[prayers[0][0] as PrayerName],
        time: prayers[0][1],
      },
    };
  }

  const nextPrayer = {
    name: PRAYER_NAMES[prayers[nextPrayerIndex][0] as PrayerName],
    time: prayers[nextPrayerIndex][1],
  };

  // Current prayer is the one before the next prayer
  const currentPrayer = nextPrayerIndex > 0
    ? {
      name: PRAYER_NAMES[prayers[nextPrayerIndex - 1][0] as PrayerName],
      time: prayers[nextPrayerIndex - 1][1],
    }
    : null;

  return { current: currentPrayer, next: nextPrayer };
}

/**
 * Format current date in Indonesian
 */
export function formatCurrentDate(): string {
  return format(new Date(), 'EEEE, d MMMM yyyy', { locale: id });
}

/**
 * Format current time
 */
export function formatCurrentTime(): string {
  return format(new Date(), 'HH:mm:ss');
}