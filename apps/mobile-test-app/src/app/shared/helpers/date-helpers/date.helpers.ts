import { add, Duration, format, sub } from 'date-fns';

import { DATE_FORMATS } from '../../constants/date-formats/date-formats';

export function getUserUILocaleTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getFormattedDate(date: string | Date, dateFormat = DATE_FORMATS.dateForAPI): string {
  if (!date) return null;

  return format(date, dateFormat);
}

export function getDateShiftMs(period: Duration, startDate: Date | number = new Date(), direction: 'sub' | 'add' = 'sub'): Date {
  const date = startDate instanceof Date ? startDate : new Date(startDate);
  const fn = direction === 'sub' ? sub : add;

  return fn(date, period);
}

export function getThisMonthRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: start.toDateString(),
    endDate: end.toDateString(),
  };
}

export function getThisYearRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);

  return {
    startDate: start.toDateString(),
    endDate: end.toDateString(),
  };
}

export function getDisplayDate(date: Date): string {
  if (!date) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export function getISOString(date: Date | null): string {
  return date ? date.toISOString().substring(0, 10) : '';
}

export function validateDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === '') return null;

  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(dateRegex);

  if (!match) return null;

  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) return null;

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;

  return date;
}
