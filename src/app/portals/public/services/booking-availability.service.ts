import { Injectable } from '@angular/core';
import { DayOfWeek } from '../../../core/models';

export interface WorkingDay {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

const DAY_NAMES: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Shared booking availability service used by Patient Booking (Step 2 + 3),
 * Staff Walk-in, and Admin Walk-in.
 *
 * All date logic uses Asia/Manila timezone because that is the clinic's
 * operating timezone.
 *
 * This service now only owns pure Manila date helpers.
 */
@Injectable({ providedIn: 'root' })
export class BookingAvailabilityService {
  /** Today's date in Asia/Manila as YYYY-MM-DD. */
  getManilaTodayIso(): string {
    return getManilaDateStr(new Date());
  }

  /** Convert a YYYY-MM-DD string to a normalized DayOfWeek name in Manila timezone. */
  getManilaDayOfWeek(dateStr: string): DayOfWeek {
    const dow = getManilaDayIndex(dateStr);
    return DAY_NAMES[dow] ?? 'Monday';
  }

  /**
   * Check if `dateStr` (YYYY-MM-DD) is today in Asia/Manila.
   * This is used instead of `isDateTodayInManila` in step-slot-select.
   */
  isManilaToday(dateStr: string): boolean {
    return dateStr === this.getManilaTodayIso();
  }

  /**
   * Check if `dateStr` is in the past relative to Asia/Manila.
   * Treats today as NOT past.
   */
  isManilaPast(dateStr: string): boolean {
    return dateStr < this.getManilaTodayIso();
  }

  /**
   * Get the date string for `offsetDays` from today in Asia/Manila.
   * offsetDays=0 -> today, offsetDays=1 -> tomorrow, etc.
   */
  getManilaDateOffset(offsetDays: number): string {
    const manilaNow = getManilaNow();
    const target = new Date(manilaNow.getTime() + offsetDays * 86400000);
    return getManilaDateStr(target);
  }
}

function getManilaNow(): Date {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(new Date());

  const get = (type: string): string => parts.find((p) => p.type === type)?.value ?? '0';
  return new Date(
    Number(get('year')),
    Number(get('month')) - 1,
    Number(get('day')),
    Number(get('hour')),
    Number(get('minute')),
    Number(get('second'))
  );
}

function getManilaDateStr(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const get = (type: string): string => parts.find((p) => p.type === type)?.value ?? '0';
  const year = get('year');
  const month = get('month');
  const day = get('day');
  return `${year}-${month}-${day}`;
}

function getManilaDayIndex(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long'
  }).formatToParts(date);

  const dayName = parts.find((p) => p.type === 'weekday')?.value ?? 'Monday';
  const idx = DAY_NAMES.findIndex((d) => d.toLowerCase() === dayName.toLowerCase());
  return idx >= 0 ? idx : 1;
}
