const STOCKHOLM = 'Europe/Stockholm';

export function europeEditionLabel(now = new Date()): string {
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: STOCKHOLM }).format(now);
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', timeZone: STOCKHOLM }).format(now);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: STOCKHOLM }).format(now);
  const year = new Intl.DateTimeFormat('en-GB', { year: 'numeric', timeZone: STOCKHOLM }).format(now);
  return `Europe edition · ${weekday} ${day} ${month} ${year}`;
}

export function formatLongDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatShortDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function zoneLabel(timeZone: string | undefined): string {
  if (!timeZone) return 'UTC';
  const city = timeZone.split('/').pop() || timeZone;
  return city.replaceAll('_', ' ');
}

/** Date and time in the event timezone, for example "Fri 6 Nov 2026, 23:00 (Oslo)". */
export function formatEventWhen(iso: string | undefined, timeZone: string | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  const zone = timeZone || 'UTC';
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: zone,
    }).formatToParts(date);
  } catch {
    return undefined;
  }
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  const hour = value('hour').padStart(2, '0');
  const minute = value('minute').padStart(2, '0');
  return `${value('weekday')} ${value('day')} ${value('month')} ${value('year')}, ${hour}:${minute} (${zoneLabel(zone)})`;
}

export function eventDateParts(iso: string | undefined): { day: string; weekday: string } | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit', timeZone: 'UTC' }).format(date);
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' })
    .format(date)
    .toUpperCase();
  return { day, weekday };
}
