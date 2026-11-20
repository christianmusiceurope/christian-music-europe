import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addCalendarDays, addCalendarMonths } from './dates';
import {
  filterAndSortArtistReleases,
  formatOutLabel,
  isUpcomingRelease,
  releaseWindow,
} from './releases';

test('release window is 29 days back and 12 months ahead, inclusive', () => {
  const window = releaseWindow(new Date('2026-11-20T12:00:00+02:00'));
  assert.equal(window.today, '2026-11-20');
  assert.equal(window.since, '2026-10-22');
  assert.equal(window.until, '2027-11-20');
});

test('addCalendarMonths clamps the day', () => {
  assert.equal(addCalendarMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addCalendarDays('2026-11-20', -29), '2026-10-22');
});

test('upcoming label omits the year in the same calendar year', () => {
  assert.equal(formatOutLabel('2026-12-05', '2026-11-20'), 'Out 5 Dec');
  assert.equal(formatOutLabel('2027-01-05', '2026-11-20'), 'Out 5 Jan 2027');
  assert.equal(formatOutLabel('2026-11-20', '2026-11-20'), 'Out now');
  assert.equal(formatOutLabel('2026-10-22', '2026-11-20'), 'Out now');
  assert.equal(isUpcomingRelease('2026-12-05', '2026-11-20'), true);
  assert.equal(isUpcomingRelease('2026-11-20', '2026-11-20'), false);
});

test('sorts upcoming soonest first, then already-out newest first, and drops dates outside the window', () => {
  const now = new Date('2026-11-20T12:00:00+02:00');
  const sorted = filterAndSortArtistReleases(
    [
      { id: 'old', title: 'Too old', releaseDate: '2026-10-21' },
      { id: 'recent', title: 'Recent', releaseDate: '2026-11-01' },
      { id: 'today', title: 'Today', releaseDate: '2026-11-20' },
      { id: 'later', title: 'Later', releaseDate: '2026-12-20' },
      { id: 'soon', title: 'Soon', releaseDate: '2026-12-05' },
      { id: 'far', title: 'Too far', releaseDate: '2027-11-21' },
    ],
    now,
  );
  assert.deepEqual(
    sorted.map((release) => release.id),
    ['soon', 'later', 'today', 'recent'],
  );
});
