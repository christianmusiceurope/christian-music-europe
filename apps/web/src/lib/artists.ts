import { linDFixture } from '../fixtures/resolve';
import { clearedForSite, presentPortableText } from './images';
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
    eventType?: string;
    city?: string;
    countryName?: string;
    venueName?: string;
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

function fromSanity(doc: SanityArtist): ArtistPageData | null {
  if (!doc.name || !doc.slug) return null;
  const biography = presentPortableText(doc.biography);
  const relatedVideos = (doc.videoGroups ?? []).flatMap((group) =>
    (group?.embeds ?? []).flatMap((embed) => {
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
    languages: (doc.languages ?? []).filter((language): language is string => Boolean(language)),
    biography,
    website: doc.website,
    spotifyArtistId: doc.spotifyArtistId,
    youtubeUrl: doc.youtubeUrl,
    image: clearedForSite(doc.image),
    countries: (doc.countryAssociations ?? []).flatMap((association) => {
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
    genres: (doc.genres ?? []).flatMap((genre) => {
      if (!genre?.name || !genre._id) return [];
      return [{ id: genre._id, name: genre.name, slug: genre.slug }];
    }),
    articles: (doc.articles ?? []).flatMap((article) => {
      if (!article?.title || !article._id) return [];
      return [
        {
          id: article._id,
          title: article.title,
          slug: article.slug,
          articleType: article.articleType,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          heroImage: clearedForSite(article.heroImage),
        },
      ];
    }),
    releases: (doc.releases ?? []).flatMap((release) => {
      if (!release?.title || !release._id) return [];
      return [
        {
          id: release._id,
          title: release.title,
          slug: release.slug,
          releaseType: release.releaseType,
          releaseDate: release.releaseDate,
          cover: clearedForSite(release.coverArtwork),
        },
      ];
    }),
    events: (doc.events ?? []).flatMap((event) => {
      if (!event?.title || !event._id) return [];
      return [
        {
          id: event._id,
          title: event.title,
          slug: event.slug,
          startDateTime: event.startDateTime,
          eventType: event.eventType,
          city: event.city,
          countryName: event.countryName,
          venueName: event.venueName,
        },
      ];
    }),
    videos: dedupeVideos([...videosInPortableText(biography), ...relatedVideos]),
    sources: (doc.sources ?? []).flatMap((source) => {
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
  const rows = await sanityClient.fetch<Array<{ slug?: string }>>(ARTIST_SLUGS_QUERY);
  return rows.flatMap((row) => (row.slug ? [row.slug] : []));
}

export async function getArtist(slug: string): Promise<ArtistPageData | null> {
  if (contentSource === 'fixture') {
    const fixture = linDFixture();
    return fixture.slug === slug ? fixture : null;
  }

  const doc = await sanityClient.fetch<SanityArtist | null>(ARTIST_BY_SLUG_QUERY, { slug });
  if (!doc) return null;
  return fromSanity(doc);
}
