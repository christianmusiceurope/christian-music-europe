import { defineQuery } from 'groq';
import { imageForSite, imageForSquare } from './images';
import { filterAndSortArtistReleases, releaseWindow } from './releases';
import { contentSource, LICENSED_IMAGE_FIELDS, sanityClient } from './sanity';
import { mapSocialPost, WIDE_POST_LIMIT, type RawSocialPost } from './social';
import type { ArticleCard, LicensedImage, ReleaseCard, SocialPostCard } from './types';

/** Homepage limits. */
export const HOME_RELEASE_LIMIT = 6;
export const HOME_EVENT_ROW_LIMIT = 6;
export const HOME_POST_LIMIT = WIDE_POST_LIMIT;
export const HOME_ARTICLE_LIMIT = 6;

export const HOME_QUERY = defineQuery(/* groq */ `{
  "releases": *[
    _type == "release" &&
    defined(releaseDate) &&
    releaseDate >= $since &&
    releaseDate <= $until &&
    defined(primaryArtist->slug.current)
  ] | order(releaseDate desc)[0...40]{
    _id,
    title,
    "slug": slug.current,
    releaseType,
    releaseDate,
    coverArtwork{${LICENSED_IMAGE_FIELDS}},
    links{
      spotify,
      appleMusic,
      youtube,
      other[]{ label, url }
    },
    "primaryArtist": primaryArtist->{ name, "slug": slug.current },
    "additionalArtists": additionalArtists[]->{ name, "slug": slug.current }
  },
  "events": *[
    _type == "event" &&
    defined(startDateTime) &&
    startDateTime >= now() &&
    eventStatus != "cancelled"
  ] | order(startDateTime asc)[0...20]{
    _id,
    title,
    startDateTime,
    endDateTime,
    timezone,
    eventType,
    eventStatus,
    ticketStatus,
    ticketUrl,
    officialSourceUrl,
    "artists": performingArtists[]->{ name, "slug": slug.current },
    venue->{
      name,
      city,
      "countryName": country->name
    },
    festival->{
      _id,
      name,
      website
    }
  },
  "posts": *[_type == "socialPost" && defined(url) && defined(postedAt)] | order(postedAt desc)[0...${HOME_POST_LIMIT}]{
    _id,
    platform,
    url,
    postedAt,
    captionExcerpt,
    spotlight,
    coverImage{
      alt,
      "url": asset->url
    }
  },
  "articles": *[_type == "article" && defined(slug.current) && defined(title)] | order(publishedAt desc)[0...${HOME_ARTICLE_LIMIT}]{
    _id,
    title,
    "slug": slug.current,
    articleType,
    excerpt,
    publishedAt,
    heroImage{${LICENSED_IMAGE_FIELDS}}
  }
}`);

export type ArtistRef = { name: string; slug?: string };

export type HomeRelease = ReleaseCard & {
  primaryArtist: ArtistRef & { slug: string };
};

export type HomeEvent = {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime?: string;
  timezone?: string;
  eventType?: string;
  ticketStatus?: string;
  ticketUrl?: string;
  officialSourceUrl?: string;
  artists: ArtistRef[];
  venueName?: string;
  city?: string;
  countryName?: string;
  festival?: { id: string; name: string; website?: string };
};

/** One row in Live in Europe: a standalone event, or every upcoming event of one festival. */
export type LiveRow =
  | { kind: 'event'; event: HomeEvent }
  | {
      kind: 'festival';
      festival: { id: string; name: string; website?: string };
      events: HomeEvent[];
      city?: string;
      countryName?: string;
    };

export type HomeContent = {
  releases: HomeRelease[];
  live: LiveRow[];
  posts: SocialPostCard[];
  articles: ArticleCard[];
};

type Raw<T> = T | null | undefined;

type RawRelease = {
  _id?: string;
  title?: string;
  slug?: string;
  releaseType?: string;
  releaseDate?: string;
  coverArtwork?: LicensedImage | null;
  links?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    other?: Array<Raw<{ label?: string; url?: string }>> | null;
  } | null;
  primaryArtist?: Raw<{ name?: string; slug?: string }>;
  additionalArtists?: Array<Raw<{ name?: string; slug?: string }>> | null;
};

type RawEvent = {
  _id?: string;
  title?: string;
  startDateTime?: string;
  endDateTime?: string;
  timezone?: string;
  eventType?: string;
  eventStatus?: string;
  ticketStatus?: string;
  ticketUrl?: string;
  officialSourceUrl?: string;
  artists?: Array<Raw<{ name?: string; slug?: string }>> | null;
  venue?: Raw<{ name?: string; city?: string; countryName?: string }>;
  festival?: Raw<{ _id?: string; name?: string; website?: string }>;
};

type RawArticle = {
  _id?: string;
  title?: string;
  slug?: string;
  articleType?: string;
  excerpt?: string;
  publishedAt?: string;
  heroImage?: LicensedImage | null;
};

export type RawHome = {
  releases?: Array<Raw<RawRelease>> | null;
  events?: Array<Raw<RawEvent>> | null;
  posts?: Array<Raw<RawSocialPost>> | null;
  articles?: Array<Raw<RawArticle>> | null;
};

function list<T>(value: Array<Raw<T>> | null | undefined): T[] {
  return Array.isArray(value) ? value.filter((item): item is T => item != null) : [];
}

function artistRefs(value: Array<Raw<{ name?: string; slug?: string }>> | null | undefined): ArtistRef[] {
  return list(value).flatMap((artist) => (artist.name ? [{ name: artist.name, slug: artist.slug }] : []));
}

export function mapHomeReleases(raw: RawHome['releases'], now = new Date()): HomeRelease[] {
  const cards = list(raw).flatMap((release): HomeRelease[] => {
    const artist = release.primaryArtist;
    if (!release._id || !release.title || !artist?.name || !artist.slug) return [];
    const other = list(release.links?.other).flatMap((link) =>
      link.label && link.url ? [{ label: link.label, url: link.url }] : [],
    );
    const additional = artistRefs(release.additionalArtists);
    return [
      {
        id: release._id,
        title: release.title,
        slug: release.slug,
        releaseType: release.releaseType,
        releaseDate: release.releaseDate,
        cover: imageForSquare(release.coverArtwork),
        links: release.links
          ? {
              spotify: release.links.spotify,
              appleMusic: release.links.appleMusic,
              youtube: release.links.youtube,
              other: other.length ? other : undefined,
            }
          : undefined,
        additionalArtists: additional.length ? additional : undefined,
        primaryArtist: { name: artist.name, slug: artist.slug },
      },
    ];
  });
  return (filterAndSortArtistReleases(cards, now) as HomeRelease[]).slice(0, HOME_RELEASE_LIMIT);
}

export function mapHomeEvents(raw: RawHome['events']): HomeEvent[] {
  return list(raw).flatMap((event): HomeEvent[] => {
    if (!event._id || !event.title || !event.startDateTime || event.eventStatus === 'cancelled') return [];
    const festival = event.festival?._id && event.festival.name
      ? { id: event.festival._id, name: event.festival.name, website: event.festival.website }
      : undefined;
    return [
      {
        id: event._id,
        title: event.title,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        timezone: event.timezone,
        eventType: event.eventType,
        ticketStatus: event.ticketStatus,
        ticketUrl: event.ticketUrl,
        officialSourceUrl: event.officialSourceUrl,
        artists: artistRefs(event.artists),
        venueName: event.venue?.name,
        city: event.venue?.city,
        countryName: event.venue?.countryName,
        festival,
      },
    ];
  });
}

/**
 * Groups events that share a festival into one row, placed where the festival's
 * first upcoming event falls. Standalone events stay as single rows.
 */
export function groupLiveRows(events: HomeEvent[], limit = HOME_EVENT_ROW_LIMIT): LiveRow[] {
  const rows: LiveRow[] = [];
  const festivals = new Map<string, Extract<LiveRow, { kind: 'festival' }>>();
  for (const event of events) {
    if (!event.festival) {
      rows.push({ kind: 'event', event });
      continue;
    }
    const existing = festivals.get(event.festival.id);
    if (existing) {
      existing.events.push(event);
      continue;
    }
    const row: Extract<LiveRow, { kind: 'festival' }> = {
      kind: 'festival',
      festival: event.festival,
      events: [event],
      city: event.city,
      countryName: event.countryName,
    };
    festivals.set(event.festival.id, row);
    rows.push(row);
  }
  for (const row of festivals.values()) {
    if (row.events.some((event) => event.city !== row.city)) row.city = undefined;
    if (row.events.some((event) => event.countryName !== row.countryName)) row.countryName = undefined;
  }
  return rows.slice(0, limit);
}

export function mapHomeArticles(raw: RawHome['articles']): ArticleCard[] {
  return list(raw).flatMap((article) => {
    if (!article._id || !article.title || !article.slug) return [];
    return [
      {
        id: article._id,
        title: article.title,
        slug: article.slug,
        articleType: article.articleType,
        excerpt: article.excerpt,
        publishedAt: article.publishedAt,
        heroImage: imageForSite(article.heroImage),
      },
    ];
  });
}

export function mapHomeContent(raw: RawHome | null | undefined, now = new Date()): HomeContent {
  return {
    releases: mapHomeReleases(raw?.releases, now),
    live: groupLiveRows(mapHomeEvents(raw?.events)),
    posts: list(raw?.posts).flatMap((post) => {
      const mapped = mapSocialPost(post);
      return mapped ? [mapped] : [];
    }).slice(0, HOME_POST_LIMIT),
    articles: mapHomeArticles(raw?.articles),
  };
}

const EMPTY: HomeContent = { releases: [], live: [], posts: [], articles: [] };

let cached: Promise<HomeContent> | undefined;

/** Published homepage content. Fetched once per build and shared with the header, menu and footer. */
export function getHomeContent(): Promise<HomeContent> {
  if (!cached) {
    cached = (async () => {
      if (contentSource !== 'sanity') return EMPTY;
      const window = releaseWindow();
      const raw = await sanityClient.fetch<RawHome | null>(HOME_QUERY, {
        since: window.since,
        until: window.until,
      });
      return mapHomeContent(raw);
    })();
  }
  return cached;
}

export type HomeSections = {
  releases: boolean;
  live: boolean;
  channels: boolean;
  articles: boolean;
};

/** Which homepage blocks render, so navigation only links to sections that exist. */
export async function getHomeSections(): Promise<HomeSections> {
  const content = await getHomeContent();
  return {
    releases: content.releases.length > 0,
    live: content.live.length > 0,
    channels: content.posts.length > 0,
    articles: content.articles.length > 0,
  };
}
