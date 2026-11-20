import { addCalendarDays, addCalendarMonths, formatDateOnly, todayInHelsinki } from './dates';
import type { ReleaseCard } from './types';

/** Inclusive window: the last 30 days (today included) through 12 months ahead. */
export const RELEASE_LOOKBACK_DAYS = 29;
export const RELEASE_AHEAD_MONTHS = 12;

export function releaseWindow(now = new Date()): { today: string; since: string; until: string } {
  const today = todayInHelsinki(now);
  return {
    today,
    since: addCalendarDays(today, -RELEASE_LOOKBACK_DAYS),
    until: addCalendarMonths(today, RELEASE_AHEAD_MONTHS),
  };
}

export function releaseDay(iso: string | undefined): string | undefined {
  const match = iso?.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1];
}

export function isUpcomingRelease(iso: string | undefined, today = todayInHelsinki()): boolean {
  const day = releaseDay(iso);
  return Boolean(day && day > today);
}

export function isReleaseInWindow(
  iso: string | undefined,
  window: { since: string; until: string } = releaseWindow(),
): boolean {
  const day = releaseDay(iso);
  return Boolean(day && day >= window.since && day <= window.until);
}

/**
 * Upcoming first, soonest first; then already-out releases, newest first.
 */
export function sortArtistReleases(releases: ReleaseCard[], today = todayInHelsinki()): ReleaseCard[] {
  return [...releases].sort((left, right) => {
    const leftDay = releaseDay(left.releaseDate) ?? '';
    const rightDay = releaseDay(right.releaseDate) ?? '';
    const leftUpcoming = leftDay > today;
    const rightUpcoming = rightDay > today;
    if (leftUpcoming && rightUpcoming) return leftDay.localeCompare(rightDay);
    if (leftUpcoming) return -1;
    if (rightUpcoming) return 1;
    return rightDay.localeCompare(leftDay);
  });
}

export function filterAndSortArtistReleases(
  releases: ReleaseCard[],
  now = new Date(),
): ReleaseCard[] {
  const window = releaseWindow(now);
  return sortArtistReleases(
    releases.filter((release) => isReleaseInWindow(release.releaseDate, window)),
    window.today,
  );
}

/** "Out now", "Out 5 Dec", or "Out 5 Dec 2027" when the year is not the current calendar year. */
export function formatOutLabel(iso: string | undefined, today = todayInHelsinki()): string | undefined {
  const day = releaseDay(iso);
  if (!day) return undefined;
  if (day <= today) return 'Out now';
  const formatted = formatDateOnly(day);
  if (!formatted) return undefined;
  if (day.slice(0, 4) === today.slice(0, 4)) {
    return `Out ${formatted.replace(/\s+\d{4}$/, '')}`;
  }
  return `Out ${formatted}`;
}
