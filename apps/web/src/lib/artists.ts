import { linDFixture } from '../fixtures/resolve';
import { imageForSite, presentPortableText } from './images';
import { artistTypeLabel, relationshipLabel } from './labels';
import {
  ARTIST_BY_SLUG_QUERY,
  ARTIST_SLUGS_QUERY,
  contentSource,
  sanityClient,
} from './sanity';
import { videosInPortableText } from './text';
import type { ArtistPageData, ArtistVideo, LicensedImage, PortableTextBlock } from './types';

type SanityArtist = {
  _id?: string;
  name?: string;
  slug?: string;
  artistType?: string;
  languages?: string[];
  biography?: PortableTextBlock[];
  website?: string;
  spotifyArtistId?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  image?: LicensedImage | null;
  countryAssociations?: Array<{
    _key?: string;
    relationshipType?: string;
    primary?: boolean;
    country?: { _id?: string; name?: string; slug?: string; isoCode?: string } | null;
  }>;
  genres?: Array<{ _id?: string; name?: string; slug?: string } | null>;
  sources?: Array<{ _key?: string; label?: string; url?: string; accessedAt?: string } | null>;
  articles?: Array<{
    _id?: string;
    title?: string;
    slug?: string;
    articleType?: string;
    excerpt?: string;
    publishedAt?: string;
    heroImage?: LicensedImage | null;
  } | null>;
  releases?: Array<{
    _id?: string;
    title?: string;
    slug?: string;
    releaseType?: string;
    releaseDate?: string;
    coverArtwork?: LicensedImage | null;
  } | null>;
  events?: Array<{
    _id?: string;
    title?: string;
    slug?: string;
    startDateTime?: string;
    timezone?: string;
    eventType?: string;
    eventStatus?: string;
    ticketStatus?: string;
    ticketUrl?: string;
    officialSourceUrl?: string;
    venue?: { name?: string; city?: string; countryName?: string } | null;
    festival?: { name?: string; slug?: string; website?: string } | null;
  } | null>;
  videoGroups?: Array<{ embeds?: Array<{ _key?: string; url?: string; title?: string } | null> | null } | null>;
};

function dedupeVideos(videos: ArtistVideo[]): ArtistVideo[] {
  const seen = new Set<string>();
  return videos.filter((video) => {
    if (seen.has(video.url)) return false;
    seen.add(video.url);
    return true;
  });
}

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value.filter((item) => item != null) : [];
}

function fromSanity(doc: SanityArtist): ArtistPageData | null {
  if (!doc.name || !doc.slug) return null;
  const biography = presentPortableText(doc.biography);
  const relatedVideos = asArray(doc.videoGroups).flatMap((group) =>
    asArray(group?.embeds).flatMap((embed) => {
      if (!embed?.url) return [];
      return [
        {
          key: embed._key ?? embed.url,
          url: embed.url,
          title: embed.title?.trim() || 'YouTube video',
        },
      ];
    }),
  );

  return {
    id: doc._id ?? doc.slug,
    name: doc.name,
    slug: doc.slug,
    artistType: doc.artistType ?? 'solo',
    artistTypeLabel: artistTypeLabel(doc.artistType),
    languages: asArray(doc.languages).filter((language): language is string => Boolean(language)),
    biography,
    website: doc.website,
    spotifyArtistId: doc.spotifyArtistId,
    youtubeUrl: doc.youtubeUrl,
    instagramUrl: doc.instagramUrl,
    tiktokUrl: doc.tiktokUrl,
    xUrl: doc.xUrl,
    facebookUrl: doc.facebookUrl,
    image: imageForSite(doc.image),
    countries: asArray(doc.countryAssociations).flatMap((association) => {
      const name = association?.country?.name;
      if (!name) return [];
      const relationshipType = association.relationshipType ?? 'other';
      return [
        {
          key: association._key ?? name,
          name,
          slug: association.country?.slug,
          isoCode: association.country?.isoCode,
          relationshipType,
          relationshipLabel: relationshipLabel(relationshipType),
          primary: Boolean(association.primary),
        },
      ];
    }),
    genres: asArray(doc.genres).flatMap((genre) => {
      if (!genre?.name || !genre._id) return [];
      return [{ id: genre._id, name: genre.name, slug: genre.slug }];
    }),
    articles: asArray(doc.articles).flatMap((article) => {
      if (!article?.title || !article._id) return [];
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
    }),
    releases: asArray(doc.releases).flatMap((release) => {
      if (!release?.title || !release._id) return [];
      return [
        {
          id: release._id,
          title: release.title,
          slug: release.slug,
          releaseType: release.releaseType,
          releaseDate: release.releaseDate,
          cover: imageForSite(release.coverArtwork),
        },
      ];
    }),
    events: asArray(doc.events).flatMap((event) => {
      if (!event?.title || !event._id || event.eventStatus === 'cancelled') return [];
      return [
        {
          id: event._id,
          title: event.title,
          slug: event.slug,
          startDateTime: event.startDateTime,
          timezone: event.timezone,
          eventType: event.eventType,
          eventStatus: event.eventStatus,
          ticketStatus: event.ticketStatus,
          ticketUrl: event.ticketUrl,
          officialSourceUrl: event.officialSourceUrl,
          venueName: event.venue?.name,
          city: event.venue?.city,
          countryName: event.venue?.countryName,
          festivalName: event.festival?.name,
          festivalSlug: event.festival?.slug,
          festivalWebsite: event.festival?.website,
        },
      ];
    }),
    videos: dedupeVideos([...videosInPortableText(biography), ...relatedVideos]),
    sources: asArray(doc.sources).flatMap((source) => {
      if (!source?.label) return [];
      return [
        {
          key: source._key ?? source.label,
          label: source.label,
          url: source.url,
          accessedAt: source.accessedAt,
        },
      ];
    }),
  };
}

export async function getArtistSlugs(): Promise<string[]> {
  if (contentSource === 'fixture') return ['lin-d'];
  const rows = await sanityClient.fetch<Array<{ slug?: string }> | null>(ARTIST_SLUGS_QUERY);
  if (!Array.isArray(rows)) {
    throw new Error(
      'Sanity did not return a list of published artists. Check that project rg6onak7, dataset production, is publicly readable.',
    );
  }
  return rows.flatMap((row) => (row?.slug ? [row.slug] : []));
}

export async function getArtist(slug: string): Promise<ArtistPageData | null> {
  if (contentSource === 'fixture') {
    const fixture = linDFixture();
    if (fixture.slug !== slug) return null;
    return {
      ...fixture,
      image: imageForSite(fixture.image),
      biography: presentPortableText(fixture.biography),
    };
  }

  const doc = await sanityClient.fetch<SanityArtist | null>(ARTIST_BY_SLUG_QUERY, { slug });
  if (!doc) return null;
  return fromSanity(doc);
}
