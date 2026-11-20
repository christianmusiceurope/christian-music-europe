import { defineQuery } from 'groq';
import grid from '../data/europe-dots.json';
import cityLookup from '../data/venue-cities.json';
import { imageIsUsable } from './images';
import { contentSource, sanityClient } from './sanity';
import type { LicensedImage } from './types';

/**
 * Data for the dot-matrix Europe map on /countries.
 * Artists are placed by country only. Events are placed by venue city: the
 * venue `location` geopoint when set, otherwise src/data/venue-cities.json.
 * Releases are placed by their artists' countries (primary and additional
 * artists, European editorial scope only), counted once per country.
 * Published documents only, even when a drafts token is configured.
 */

/** How far back the build fetches releases. The page filters to the last 30 or 90 days in the browser. */
export const RELEASE_FETCH_DAYS = 120;

const publishedClient = sanityClient.withConfig({ perspective: 'published' });

export const MAP_COUNTRIES_QUERY = defineQuery(/* groq */ `
  *[_type == "country" && europeanEditorialScope == true && defined(isoCode)] | order(name asc){
    name,
    "slug": slug.current,
    isoCode,
    "flag": flag{ alt, "url": asset->url }
  }
`);

export const MAP_ARTISTS_QUERY = defineQuery(/* groq */ `
  *[_type == "artist" && defined(slug.current)] | order(name asc){
    name,
    "slug": slug.current,
    "countries": countryAssociations[].country->{ isoCode, europeanEditorialScope },
    "image": image{ rightsStatus, "url": asset->url }
  }
`);

export const MAP_EVENTS_QUERY = defineQuery(/* groq */ `
  *[_type == "event" && defined(startDateTime) && startDateTime >= now() && eventStatus != "cancelled"]
    | order(startDateTime asc){
    _id,
    title,
    startDateTime,
    timezone,
    "venue": venue->{
      name,
      city,
      location,
      "country": country->{ isoCode, name, europeanEditorialScope }
    }
  }
`);

export const MAP_RELEASES_QUERY = defineQuery(/* groq */ `
  *[_type == "release" && defined(releaseDate) && releaseDate >= $since && defined(primaryArtist)]
    | order(releaseDate desc, title asc){
    _id,
    title,
    releaseType,
    releaseDate,
    "cover": coverArtwork{ rightsStatus, "url": asset->url },
    "artists": [primaryArtist->{ name, "slug": slug.current, "countries": countryAssociations[].country->{ isoCode, europeanEditorialScope } }]
      + coalesce(additionalArtists[]->{ name, "slug": slug.current, "countries": countryAssociations[].country->{ isoCode, europeanEditorialScope } }, [])
  }
`);

export type MapRelease = {
  id: string;
  title: string;
  type?: string;
  /** YYYY-MM-DD */
  date: string;
  artists: Array<{ name: string; slug?: string }>;
  /** Where the release links to: the primary artist's page (there are no release pages yet). */
  href?: string;
  /** Square crop of the cleared cover artwork. */
  cover?: string;
  cover2x?: string;
  /** Map country codes this release counts for, each once. */
  countries: string[];
};

export type MapArtist = {
  name: string;
  slug: string;
  /** Small square crop of the artist's licensed Sanity photo (cleared images only). */
  photo?: string;
  photo2x?: string;
};

/** Square thumbnail from the Sanity image CDN, cropped from the top so portraits keep the face. */
export function thumbSanityImage(url: string, size: number): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'cdn.sanity.io') return undefined;
    parsed.searchParams.set('w', String(size));
    parsed.searchParams.set('h', String(size));
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('crop', 'top');
    parsed.searchParams.set('fm', 'webp');
    parsed.searchParams.set('q', '75');
    return parsed.toString();
  } catch {
    return undefined;
  }
}
export type MapCountry = {
  code: string;
  name: string;
  slug?: string;
  hasDots: boolean;
  artists: MapArtist[];
  /** Country these artists are shown under on the map, when the country has no dots (Vatican City). */
  mapCode: string;
  /** Square crop of the country's flag from Sanity, for the round badge. */
  flag?: { src: string; src2x: string; alt: string };
};
export type MapEvent = {
  id: string;
  title: string;
  start: string;
  timeZone?: string;
  venue: string;
  city: string;
  countryCode: string;
  countryName: string;
  /** Index into the flattened dot list, or null when the city could not be placed. */
  dot: number | null;
};
export type MapGrid = {
  nx: number;
  ny: number;
  /** Country code to flat [i, j, i, j, ...] cell list. */
  dots: Record<string, number[]>;
  /** Country code to [x, y] visual centre in grid units (mainland pole of inaccessibility). */
  centres: Record<string, [number, number]>;
};
export type MapData = {
  grid: MapGrid;
  countries: MapCountry[];
  events: MapEvent[];
  unplacedEvents: number;
  releases: MapRelease[];
};

const MAP_ALIAS: Record<string, string> = { VA: 'IT' };

type Grid = typeof grid;

function project(lat: number, lng: number, g: Grid): { fi: number; fj: number } {
  const { lon0, lat0, radiusKm, xmin, ymax } = g.projection;
  const rad = Math.PI / 180;
  const l = lng * rad, p = lat * rad, l0 = lon0 * rad, p0 = lat0 * rad;
  const k = Math.sqrt(2 / (1 + Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0)));
  const x = radiusKm * k * Math.cos(p) * Math.sin(l - l0);
  const y = radiusKm * k * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0));
  return { fi: (x - xmin) / g.spacingKm, fj: (ymax - y) / g.spacingKm };
}

/** Flattened dot order: countries in key order, cells in file order. Same order the page renders. */
export function dotOffsets(dots: Record<string, number[]>): Record<string, number> {
  const offsets: Record<string, number> = {};
  let n = 0;
  for (const [code, cells] of Object.entries(dots)) {
    offsets[code] = n;
    n += cells.length / 2;
  }
  return offsets;
}

function nearestDot(code: string, lat: number, lng: number): number | null {
  const cells = (grid.dots as Record<string, number[]>)[code];
  if (!cells) return null;
  const { fi, fj } = project(lat, lng, grid);
  let best = -1, bestD = Infinity;
  for (let n = 0; n < cells.length; n += 2) {
    const d = (cells[n] + 0.5 - fi) ** 2 + (cells[n + 1] + 0.5 - fj) ** 2;
    if (d < bestD) { bestD = d; best = n / 2; }
  }
  // More than ~4 cells (about 220 km) away means the coordinates are probably wrong.
  if (best < 0 || bestD > 16) return null;
  return dotOffsets(grid.dots as Record<string, number[]>)[code] + best;
}

/** Flag thumbnails for the 44px round badge (1x and 2x). Flags carry their own source and licence in Sanity. */
function flagOf(c: { name?: string; flag?: { alt?: string; url?: string } | null }): { flag?: MapCountry['flag'] } {
  const url = c.flag?.url;
  if (!url) return {};
  const src = flagThumb(url, 44), src2x = flagThumb(url, 88);
  return src && src2x ? { flag: { src, src2x, alt: c.flag?.alt || `Flag of ${c.name}` } } : {};
}
function flagThumb(url: string, size: number): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'cdn.sanity.io') return undefined;
    parsed.searchParams.set('w', String(size));
    parsed.searchParams.set('h', String(size));
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('fm', 'png');
    return parsed.toString();
  } catch {
    return undefined;
  }
}

type RawCountry = { name?: string; slug?: string; isoCode?: string; flag?: { alt?: string; url?: string } | null };
type RawArtist = { name?: string; slug?: string; image?: LicensedImage | null; countries?: Array<{ isoCode?: string; europeanEditorialScope?: boolean } | null> | null };
type RawRelease = {
  _id: string;
  title?: string;
  releaseType?: string;
  releaseDate?: string;
  cover?: LicensedImage | null;
  artists?: Array<RawArtist | null> | null;
};
type RawEvent = {
  _id: string;
  title?: string;
  startDateTime?: string;
  timezone?: string;
  venue?: {
    name?: string;
    city?: string;
    location?: { lat?: number; lng?: number } | null;
    country?: { isoCode?: string; name?: string; europeanEditorialScope?: boolean } | null;
  } | null;
};

export async function getMapData(): Promise<MapData> {
  const gridOut: MapGrid = {
    nx: grid.nx,
    ny: grid.ny,
    dots: grid.dots as Record<string, number[]>,
    centres: grid.centres as unknown as Record<string, [number, number]>,
  };
  if (contentSource === 'fixture') return { grid: gridOut, countries: [], events: [], unplacedEvents: 0, releases: [] };

  const since = new Date(Date.now() - RELEASE_FETCH_DAYS * 86400000).toISOString().slice(0, 10);
  const [rawCountries, rawArtists, rawEvents, rawReleases] = await Promise.all([
    publishedClient.fetch<RawCountry[]>(MAP_COUNTRIES_QUERY),
    publishedClient.fetch<RawArtist[]>(MAP_ARTISTS_QUERY),
    publishedClient.fetch<RawEvent[]>(MAP_EVENTS_QUERY),
    publishedClient.fetch<RawRelease[]>(MAP_RELEASES_QUERY, { since }),
  ]);

  const byCode = new Map<string, MapCountry>();
  for (const c of rawCountries ?? []) {
    const code = c.isoCode?.toUpperCase();
    if (!code || !c.name) continue;
    byCode.set(code, {
      code,
      name: c.name,
      slug: c.slug,
      hasDots: code in gridOut.dots,
      artists: [],
      mapCode: MAP_ALIAS[code] ?? code,
      ...flagOf(c),
    });
  }
  for (const a of rawArtists ?? []) {
    if (!a.name || !a.slug) continue;
    const usable = imageIsUsable(a.image) ? a.image.url : undefined;
    const photo = usable ? thumbSanityImage(usable, 80) : undefined;
    const photo2x = usable ? thumbSanityImage(usable, 160) : undefined;
    const seen = new Set<string>();
    for (const c of a.countries ?? []) {
      const code = c?.isoCode?.toUpperCase();
      if (!code || !c?.europeanEditorialScope || seen.has(code)) continue;
      seen.add(code);
      byCode.get(code)?.artists.push({ name: a.name, slug: a.slug, ...(photo ? { photo, photo2x } : {}) });
    }
  }

  const lookup = cityLookup as unknown as Record<string, [number, number]>;
  let unplaced = 0;
  const events: MapEvent[] = [];
  for (const e of rawEvents ?? []) {
    const v = e.venue;
    const code = v?.country?.isoCode?.toUpperCase();
    if (!e.title || !e.startDateTime || !v?.city || !code || !v.country?.europeanEditorialScope) continue;
    let lat = v.location?.lat, lng = v.location?.lng;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      const hit = lookup[`${code}:${v.city.trim().toLowerCase()}`];
      if (hit) [lat, lng] = hit;
    }
    const mapCode = MAP_ALIAS[code] ?? code;
    const dot = typeof lat === 'number' && typeof lng === 'number' ? nearestDot(mapCode, lat, lng) : null;
    if (dot === null) {
      unplaced += 1;
      console.warn(`[map] Event "${e.title}" (${v.city}, ${code}) has no venue location or city lookup. Listed but not placed on the map.`);
    }
    events.push({
      id: e._id,
      title: e.title,
      start: e.startDateTime,
      timeZone: e.timezone,
      venue: v.name ?? '',
      city: v.city,
      countryCode: mapCode,
      countryName: byCode.get(mapCode)?.name ?? v.country?.name ?? code,
      dot,
    });
  }

  const releases: MapRelease[] = [];
  for (const r of rawReleases ?? []) {
    if (!r.title || !r.releaseDate) continue;
    const artists = (r.artists ?? []).filter((a): a is RawArtist => Boolean(a?.name));
    const codes = new Set<string>();
    for (const a of artists) {
      for (const c of a.countries ?? []) {
        const code = c?.isoCode?.toUpperCase();
        if (!code || !c?.europeanEditorialScope) continue;
        const mapCode = MAP_ALIAS[code] ?? code;
        if (mapCode in gridOut.dots) codes.add(mapCode);
      }
    }
    if (!codes.size) continue;
    const usable = imageIsUsable(r.cover) ? r.cover.url : undefined;
    const cover = usable ? thumbSanityImage(usable, 96) : undefined;
    const lead = artists.find((a) => a.slug);
    releases.push({
      id: r._id,
      title: r.title,
      type: r.releaseType,
      date: r.releaseDate.slice(0, 10),
      artists: artists.map((a) => ({ name: a.name!, slug: a.slug })),
      href: lead?.slug ? `/artists/${lead.slug}#new-releases` : undefined,
      ...(cover ? { cover, cover2x: thumbSanityImage(usable!, 192) } : {}),
      countries: [...codes],
    });
  }

  const countries = [...byCode.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'));
  return { grid: gridOut, countries, events, unplacedEvents: unplaced, releases };
}
