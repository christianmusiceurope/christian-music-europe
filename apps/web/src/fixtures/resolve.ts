import genresJson from './genres.json';
import linDProposal from './lin-d-proposal.json';
import { artistTypeLabel, relationshipLabel } from '../lib/labels';
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
    countries,
    genres: genreViews,
    articles: [],
    releases: [],
    events: [],
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
