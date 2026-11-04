import genresJson from './genres.json';
import linDProposal from './lin-d-proposal.json';
import { artistTypeLabel, relationshipLabel } from '../lib/labels';
import { sizedSanityImage } from '../lib/images';
import { videosInPortableText } from '../lib/text';
import type { ArtistPageData, PortableTextBlock } from '../lib/types';

type GenreDoc = {
  _id: string;
  name: string;
  slug?: { current?: string };
};

type ProposalCountry = {
  _key?: string;
  relationshipType?: string;
  primary?: boolean;
  country?: { _ref?: string };
};

type ProposalGenre = { _ref?: string; _key?: string };

type ProposalSource = {
  _key?: string;
  label?: string;
  url?: string;
  accessedAt?: string;
};

type Proposal = {
  _id: string;
  name: string;
  slug?: { current?: string };
  artistType?: string;
  languages?: string[];
  biography?: PortableTextBlock[];
  website?: string;
  spotifyArtistId?: string;
  youtubeUrl?: string;
  countryAssociations?: ProposalCountry[];
  genres?: ProposalGenre[];
  sources?: ProposalSource[];
};

/**
 * Country names for fixture references. `country-se` is the id used by the LIN D
 * proposal. The biography also states Sweden. Unknown refs are left unresolved
 * instead of being given a guessed name.
 */
const fixtureCountries: Record<string, { name: string; slug: string; isoCode: string }> = {
  'country-se': { name: 'Sweden', slug: 'sweden', isoCode: 'SE' },
};

const genres = genresJson as GenreDoc[];

function genreById(id: string | undefined) {
  if (!id) return undefined;
  return genres.find((genre) => genre._id === id);
}

export function linDFixture(): ArtistPageData {
  const doc = linDProposal as Proposal;
  const biography = doc.biography ?? [];
  const countries = (doc.countryAssociations ?? []).flatMap((association) => {
    const ref = association.country?._ref;
    const country = ref ? fixtureCountries[ref] : undefined;
    if (!country || !ref) return [];
    const relationshipType = association.relationshipType ?? 'other';
    return [
      {
        key: association._key ?? ref,
        name: country.name,
        slug: country.slug,
        isoCode: country.isoCode,
        relationshipType,
        relationshipLabel: relationshipLabel(relationshipType),
        primary: Boolean(association.primary),
      },
    ];
  });

  const genreViews = (doc.genres ?? []).flatMap((genreRef) => {
    const genre = genreById(genreRef._ref);
    if (!genre) return [];
    return [
      {
        id: genre._id,
        name: genre.name,
        slug: genre.slug?.current,
      },
    ];
  });

  return {
    id: doc._id,
    name: doc.name,
    slug: doc.slug?.current ?? 'lin-d',
    artistType: doc.artistType ?? 'band',
    artistTypeLabel: artistTypeLabel(doc.artistType),
    languages: doc.languages ?? [],
    biography,
    website: doc.website,
    spotifyArtistId: doc.spotifyArtistId,
    youtubeUrl: doc.youtubeUrl,
    image: {
      url: sizedSanityImage(
        'https://cdn.sanity.io/images/rg6onak7/production/5141d58598c9508542ba5bfd7951a3ba9aac94a7-2500x3750.webp',
      ),
      alt: 'The three members of LIN D in a studio portrait against a dark blue background',
      credit: 'Jona Granath',
      sourceType: 'official_promo',
      sourceUrl: 'https://www.lin-d.com/',
      licence: 'other',
      rightsStatus: 'restricted',
      permissionNotes:
        "Permission from LIN D's management is pending. Approved for the development site only until written clearance. Asset image-5141d58598c9508542ba5bfd7951a3ba9aac94a7-2500x3750-webp on drafts.artist-lin-d.",
    },
    countries,
    genres: genreViews,
    articles: [],
    releases: [],
    events: [
      {
        id: 'development-event-lin-d-get-focused-2026',
        title: 'LIN D at Get Focused 2026',
        slug: 'lin-d-get-focused-2026',
        startDateTime: '2026-11-06T23:00:00+01:00',
        timezone: 'Europe/Oslo',
        eventType: 'festival',
        eventStatus: 'scheduled',
        ticketStatus: 'on_sale',
        ticketUrl: 'https://tikket.no/get-focused/get-focused-2026',
        officialSourceUrl: 'https://www.getfocused.no/program',
        venueName: 'Oslofjord Convention Center',
        city: 'Melsomvik',
        countryName: 'Norway',
        festivalName: 'Get Focused',
        festivalSlug: 'get-focused',
        development: true,
      },
    ].filter((event) => {
      if (event.eventStatus === 'cancelled' || !event.startDateTime) return false;
      return new Date(event.startDateTime).getTime() >= Date.now();
    }),
    videos: videosInPortableText(biography),
    sources: (doc.sources ?? []).flatMap((source) => {
      if (!source.label) return [];
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
