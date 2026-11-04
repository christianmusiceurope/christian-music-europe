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
