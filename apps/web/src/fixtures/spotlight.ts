import type { SpotlightRecord } from '../lib/spotlight';

/**
 * Local test fixture only. Uses published Sondae fields already in Sanity.
 * Enabled with PUBLIC_CME_SPOTLIGHT_FIXTURE=true. Not used in production builds.
 */
export const sondaeSpotlightFixture: SpotlightRecord = {
  _id: 'fixture.artistSpotlight-sondae',
  startDate: '2026-11-10',
  artist: {
    _id: 'artist-sondae',
    name: 'Sondae',
    slug: 'sondae',
    biography: [
      {
        _key: 'b1',
        _type: 'block',
        children: [
          {
            _key: 'b1s',
            _type: 'span',
            marks: [],
            text: 'Sondae is a Portugal-born, Brighton-based Christian solo artist. His sound sits at the edges of R&B, indie and alternative worship.',
          },
        ],
      },
    ],
    image: {
      alt: 'Sondae in a blue work jacket with a corduroy collar, eyes closed, standing still as a blurred train passes behind him in a station',
      credit: 'Teemo Chon',
      licence: 'all_rights_reserved_with_permission',
      rightsStatus: 'cleared',
      sourceType: 'given_by_artist_or_label',
      url: 'https://cdn.sanity.io/images/rg6onak7/production/7d08103b10cf2d19fc3ad7c4e4052dd6a3173f83-1800x1202.jpg',
    },
    countryAssociations: [
      { country: { name: 'Portugal', slug: 'portugal' } },
      { country: { name: 'United Kingdom', slug: 'united-kingdom' } },
    ],
    genres: [
      { _id: 'genre-r-and-b', name: 'R&B', slug: 'r-and-b' },
      { _id: 'genre-pop', name: 'Pop', slug: 'pop' },
    ],
  },
};
