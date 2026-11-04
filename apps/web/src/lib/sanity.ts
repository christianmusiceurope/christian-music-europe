import { createClient, type SanityClient } from '@sanity/client';
import { defineQuery } from 'groq';

const rawProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2026-10-25';

/** Public project id. `yourProjectId` is the placeholder in older env examples. */
export const projectId =
  rawProjectId && rawProjectId !== 'yourProjectId' ? rawProjectId : 'rg6onak7';

export type ContentSource = 'fixture' | 'sanity';

function readServerToken(): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const token = env?.SANITY_API_READ_TOKEN?.trim();
  return token || undefined;
}

const readToken = readServerToken();

/**
 * `PUBLIC_CME_DATA_SOURCE=fixture` (default) uses local fixtures so draft
 * documents such as LIN D render without a token.
 * `sanity` reads the dataset. Drafts are included only when
 * `SANITY_API_READ_TOKEN` is set in the server environment. Never prefix that
 * token with PUBLIC_.
 */
export const contentSource: ContentSource =
  import.meta.env.PUBLIC_CME_DATA_SOURCE === 'sanity' ? 'sanity' : 'fixture';

export const sanityReadsDrafts = contentSource === 'sanity' && Boolean(readToken);

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !readToken,
  token: readToken,
  perspective: readToken ? 'drafts' : 'published',
});

export const LICENSED_IMAGE_FIELDS = /* groq */ `
  alt,
  credit,
  sourceType,
  sourceUrl,
  licence,
  permissionNotes,
  expiresAt,
  rightsStatus,
  "url": asset->url
`;

export const ARTIST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "artist" && defined(slug.current)]{ "slug": slug.current }
`);

export const ARTIST_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "artist" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    artistType,
    languages,
    biography,
    website,
    spotifyArtistId,
    youtubeUrl,
    image{${LICENSED_IMAGE_FIELDS}},
    countryAssociations[]{
      _key,
      relationshipType,
      primary,
      country->{
        _id,
        name,
        "slug": slug.current,
        isoCode
      }
    },
    genres[]->{
      _id,
      name,
      "slug": slug.current
    },
    sources[]{
      _key,
      label,
      url,
      accessedAt
    },
    "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc)[0...6]{
      _id,
      title,
      "slug": slug.current,
      articleType,
      excerpt,
      publishedAt,
      heroImage{${LICENSED_IMAGE_FIELDS}}
    },
    "releases": *[_type == "release" && references(^._id)] | order(releaseDate desc)[0...8]{
      _id,
      title,
      "slug": slug.current,
      releaseType,
      releaseDate,
      coverArtwork{${LICENSED_IMAGE_FIELDS}}
    },
    "events": *[_type == "event" && references(^._id) && startDateTime >= now()] | order(startDateTime asc)[0...8]{
      _id,
      title,
      "slug": slug.current,
      startDateTime,
      eventType,
      "city": venue->city,
      "countryName": venue->country->name,
      "venueName": venue->name
    },
    "videoGroups": *[_type == "article" && references(^._id)]{
      "embeds": body[_type == "youtubeEmbed"]{
        _key,
        url,
        title
      }
    }
  }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`);

export const ARTICLE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    articleType,
    author,
    publishedAt,
    excerpt,
    heroImage{${LICENSED_IMAGE_FIELDS}},
    body[]{
      ...,
      _type in ["image", "licensedImage"] => {
        ...,
        ${LICENSED_IMAGE_FIELDS}
      }
    },
    "artists": relatedArtists[]->{ name, "slug": slug.current },
    "countries": relatedCountries[]->{ name, "slug": slug.current },
    "genres": relatedGenres[]->{ name, "slug": slug.current },
    "releases": relatedReleases[]->{ title, "slug": slug.current, releaseType }
  }
`);
