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
 * Unset uses Sanity (project rg6onak7, dataset production).
 * Published documents only, unless `SANITY_API_READ_TOKEN` is set, which
 * switches the client to the drafts perspective. Never prefix that token
 * with PUBLIC_.
 * `PUBLIC_CME_DATA_SOURCE=fixture` is the offline opt-in.
 */
export const contentSource: ContentSource =
  import.meta.env.PUBLIC_CME_DATA_SOURCE === 'fixture' ? 'fixture' : 'sanity';

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
    instagramUrl,
    tiktokUrl,
    xUrl,
    facebookUrl,
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
    "events": *[
      _type == "event" &&
      (
        references(^._id) ||
        references(string::split(^._id, "drafts.")[1])
      ) &&
      startDateTime >= now() &&
      eventStatus != "cancelled"
    ] | order(startDateTime asc)[0...20]{
      _id,
      title,
      "slug": slug.current,
      eventType,
      startDateTime,
      timezone,
      eventStatus,
      ticketStatus,
      ticketUrl,
      officialSourceUrl,
      "venue": coalesce(
        *[_id == "drafts." + ^.venue._ref][0]{
          name,
          city,
          "countryName": coalesce(
            *[_id == "drafts." + ^.country._ref][0].name,
            country->name
          )
        },
        venue->{
          name,
          city,
          "countryName": country->name
        }
      ),
      "festival": coalesce(
        *[_id == "drafts." + ^.festival._ref][0]{
          name,
          "slug": slug.current,
          website
        },
        festival->{
          name,
          "slug": slug.current,
          website
        }
      )
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
