import {createClient, type IdentifiedSanityDocumentStub} from '@sanity/client'
import {loadStudioEnv} from './loadEnv'

loadStudioEnv()

// This script does not upload photos. Publishing copies belong in Studio as
// licensedImage values. Originals and licence proof stay in Google Drive
// 'CME Media', recorded on the 'CME Photo log' sheet.

const BLOCKED_DATASETS = new Set(['production', 'prod'])

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}. See docs/sanity-setup.md.`)
  }
  return value
}

function ref(id: string) {
  return {_type: 'reference' as const, _ref: id}
}

function keyedRef(id: string, key: string) {
  return {_type: 'reference' as const, _ref: id, _key: key}
}

function slug(current: string) {
  return {_type: 'slug' as const, current}
}

function block(text: string, key: string) {
  return {
    _type: 'block' as const,
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: `${key}-span`, text, marks: []}],
  }
}

function countryAssociation(
  countryId: string,
  relationshipType: string,
  primary: boolean,
  key: string,
  note?: string,
) {
  return {
    _type: 'countryAssociation' as const,
    _key: key,
    country: ref(countryId),
    relationshipType,
    primary,
    note,
  }
}

async function main() {
  const projectId = requiredEnv('SANITY_STUDIO_PROJECT_ID')
  const token = requiredEnv('SANITY_API_WRITE_TOKEN')
  const dataset = process.env.SANITY_SEED_DATASET || 'development'
  const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2026-10-25'

  if (BLOCKED_DATASETS.has(dataset.toLowerCase())) {
    throw new Error(
      `Refusing to seed dataset "${dataset}". This script only writes to development unless you change the guard after explicit approval.`,
    )
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })

  const datasets = await client.datasets.list()
  if (!datasets.some((item) => item.name === dataset)) {
    await client.datasets.create(dataset)
    console.log(`Created dataset "${dataset}" in project ${projectId}.`)
  }

  const documents: IdentifiedSanityDocumentStub[] = [
    {
      _id: 'country-fi',
      _type: 'country',
      name: 'Finland',
      slug: slug('finland'),
      isoCode: 'FI',
      europeanEditorialScope: true,
      europeanRegion: 'nordic',
      description: [block('Nordic editorial coverage for Finnish artists, venues, and events.', 'fi-desc')],
    },
    {
      _id: 'country-se',
      _type: 'country',
      name: 'Sweden',
      slug: slug('sweden'),
      isoCode: 'SE',
      europeanEditorialScope: true,
      europeanRegion: 'nordic',
      description: [block('Nordic editorial coverage for Swedish artists and live music.', 'se-desc')],
    },
    {
      _id: 'country-de',
      _type: 'country',
      name: 'Germany',
      slug: slug('germany'),
      isoCode: 'DE',
      europeanEditorialScope: true,
      europeanRegion: 'central_europe',
      description: [block('Central European coverage for German artists, venues, and festivals.', 'de-desc')],
    },
    {
      _id: 'country-gb',
      _type: 'country',
      name: 'United Kingdom',
      slug: slug('united-kingdom'),
      isoCode: 'GB',
      europeanEditorialScope: true,
      europeanRegion: 'western_europe',
      description: [block('Western European coverage for UK artists and touring activity.', 'gb-desc')],
    },
    {
      _id: 'country-us',
      _type: 'country',
      name: 'United States',
      slug: slug('united-states'),
      isoCode: 'US',
      europeanEditorialScope: false,
      europeanRegion: 'not_applicable',
      description: [
        block(
          'Included for world coverage and for international artists performing at European events. Not European editorial scope.',
          'us-desc',
        ),
      ],
    },
    {
      _id: 'genre-worship',
      _type: 'genre',
      name: 'Worship',
      slug: slug('worship'),
      description: 'Congregational and contemporary worship music. Editorial genre, not a faith identity label.',
    },
    {
      _id: 'genre-pop',
      _type: 'genre',
      name: 'Christian pop',
      slug: slug('christian-pop'),
      description: 'Pop-leaning songs within the Christian music editorial scope.',
    },
    {
      _id: 'artist-northern-lights',
      _type: 'artist',
      name: 'Northern Lights Collective',
      slug: slug('northern-lights-collective'),
      artistType: 'collective',
      countryAssociations: [
        countryAssociation('country-fi', 'origin', true, 'nlc-fi', 'Fictional origin association.'),
        countryAssociation('country-se', 'based_in', false, 'nlc-se', 'Also active from Sweden.'),
        countryAssociation('country-de', 'active_in', false, 'nlc-de'),
      ],
      genres: [keyedRef('genre-worship', 'nlc-g1'), keyedRef('genre-pop', 'nlc-g2')],
      languages: ['Finnish', 'English', 'Swedish'],
      biography: [
        block(
          'Fictional Nordic collective used only as development seed data. Country associations are explicit and are not inferred from touring.',
          'nlc-bio',
        ),
      ],
      website: 'https://example.com/northern-lights-collective',
      inclusionStatus: 'in_scope',
      internalNotes: 'Seed artist. Do not publish as a real act.',
      sources: [
        {
          _type: 'sourceReference',
          _key: 'nlc-src',
          label: 'Fictional seed source',
          url: 'https://example.com/sources/northern-lights',
        },
      ],
      verification: {
        _type: 'editorialVerification',
        status: 'verified',
        notes: 'Seeded development record.',
      },
    },
    {
      _id: 'artist-cedar-harbor',
      _type: 'artist',
      name: 'Cedar Harbor',
      slug: slug('cedar-harbor'),
      artistType: 'solo',
      countryAssociations: [
        countryAssociation('country-us', 'origin', true, 'ch-us', 'US origin. Performing in Europe does not change this.'),
      ],
      genres: [keyedRef('genre-pop', 'ch-g1')],
      languages: ['English'],
      biography: [
        block(
          'Fictional US artist included to test international artists at European events. Do not classify as European because of the Helsinki concert.',
          'ch-bio',
        ),
      ],
      website: 'https://example.com/cedar-harbor',
      inclusionStatus: 'in_scope',
      internalNotes: 'Seed artist. Nationality is US via country association only.',
      verification: {_type: 'editorialVerification', status: 'verified'},
    },
    {
      _id: 'venue-kallio-gospel-house',
      _type: 'venue',
      name: 'Kallio Gospel House',
      slug: slug('kallio-gospel-house'),
      city: 'Helsinki',
      country: ref('country-fi'),
      streetAddress: 'Examplekatu 12',
      postalCode: '00500',
      location: {_type: 'geopoint', lat: 60.184, lng: 24.95},
      website: 'https://example.com/kallio-gospel-house',
      description: [block('Fictional Helsinki venue for development events.', 'venue-desc')],
    },
    {
      _id: 'festival-baltic-faith',
      _type: 'festival',
      name: 'Baltic Faith Festival',
      slug: slug('baltic-faith-festival'),
      description: [block('Fictional recurring Nordic festival series. Annual editions are Event documents.', 'fest-desc')],
      organizer: 'Baltic Faith Association',
      website: 'https://example.com/baltic-faith-festival',
      countryAssociations: [
        countryAssociation('country-fi', 'based_in', true, 'bff-fi'),
        countryAssociation('country-se', 'active_in', false, 'bff-se'),
      ],
      genres: [keyedRef('genre-worship', 'bff-g1')],
    },
    {
      _id: 'song-aurora-line',
      _type: 'song',
      title: 'Aurora Line',
      slug: slug('aurora-line'),
      primaryArtist: ref('artist-northern-lights'),
      releaseDate: '2026-03-01',
      genres: [keyedRef('genre-worship', 'al-g1')],
      languages: ['English'],
      characteristics: {
        _type: 'musicCharacteristics',
        moodTags: ['hopeful', 'anthemic'],
        energyLevel: 3,
        vocalStyle: ['ensemble'],
        instrumentation: ['piano', 'strings'],
        productionCharacteristics: ['live-room'],
        similarityNotes: 'Seed characteristics only. No recommendation engine.',
      },
      description: [block('Fictional seed song.', 'al-desc')],
      verification: {_type: 'editorialVerification', status: 'unverified'},
    },
    {
      _id: 'song-harbor-light',
      _type: 'song',
      title: 'Harbor Light',
      slug: slug('harbor-light'),
      primaryArtist: ref('artist-cedar-harbor'),
      releaseDate: '2026-02-14',
      genres: [keyedRef('genre-pop', 'hl-g1')],
      languages: ['English'],
      characteristics: {
        _type: 'musicCharacteristics',
        moodTags: ['reflective'],
        energyLevel: 2,
        vocalStyle: ['solo'],
        instrumentation: ['acoustic guitar'],
      },
      description: [block('Fictional seed song by the US artist.', 'hl-desc')],
    },
    {
      _id: 'release-aurora-line',
      _type: 'release',
      title: 'Aurora Line',
      slug: slug('aurora-line'),
      releaseType: 'single',
      primaryArtist: ref('artist-northern-lights'),
      releaseDate: '2026-03-01',
      genres: [keyedRef('genre-worship', 'rel-al-g1')],
      languages: ['English'],
      trackListing: [keyedRef('song-aurora-line', 'rel-al-t1')],
      links: {
        _type: 'streamingLinks',
        youtube: 'https://www.youtube.com/watch?v=dQw4w9wgGcQ',
      },
      identifiers: {_type: 'externalIdentifiers'},
      description: [block('Fictional single used as development seed data.', 'rel-al-desc')],
    },
    {
      _id: 'release-harbor-light',
      _type: 'release',
      title: 'Harbor Light',
      slug: slug('harbor-light'),
      releaseType: 'single',
      primaryArtist: ref('artist-cedar-harbor'),
      releaseDate: '2026-02-14',
      genres: [keyedRef('genre-pop', 'rel-hl-g1')],
      languages: ['English'],
      trackListing: [keyedRef('song-harbor-light', 'rel-hl-t1')],
      description: [block('Fictional US single.', 'rel-hl-desc')],
    },
    {
      _id: 'event-cedar-harbor-helsinki',
      _type: 'event',
      title: 'Cedar Harbor live in Helsinki',
      slug: slug('cedar-harbor-live-in-helsinki'),
      eventType: 'concert',
      startDateTime: '2026-06-12T19:00:00.000Z',
      endDateTime: '2026-06-12T21:30:00.000Z',
      timezone: 'Europe/Helsinki',
      eventStatus: 'scheduled',
      ticketStatus: 'announced',
      ticketUrl: 'https://example.com/tickets/cedar-harbor-helsinki',
      performingArtists: [keyedRef('artist-cedar-harbor', 'evt-ch-a1')],
      venue: ref('venue-kallio-gospel-house'),
      description: [
        block(
          'European concert featuring a US artist. Event geography is Finland via the Helsinki venue. The artist remains associated with the United States.',
          'evt-ch-desc',
        ),
      ],
      officialSourceUrl: 'https://example.com/events/cedar-harbor-helsinki',
      lastVerifiedAt: '2026-01-15T12:00:00.000Z',
    },
    {
      _id: 'event-baltic-faith-2026',
      _type: 'event',
      title: 'Baltic Faith Festival 2026',
      slug: slug('baltic-faith-festival-2026'),
      eventType: 'festival',
      startDateTime: '2026-07-17T10:00:00.000Z',
      endDateTime: '2026-07-19T22:00:00.000Z',
      timezone: 'Europe/Helsinki',
      eventStatus: 'scheduled',
      ticketStatus: 'on_sale',
      ticketUrl: 'https://example.com/tickets/baltic-faith-2026',
      performingArtists: [
        keyedRef('artist-northern-lights', 'evt-bff-a1'),
        keyedRef('artist-cedar-harbor', 'evt-bff-a2'),
      ],
      venue: ref('venue-kallio-gospel-house'),
      festival: ref('festival-baltic-faith'),
      description: [block('Annual edition of the fictional Baltic Faith Festival series.', 'evt-bff-desc')],
    },
    {
      _id: 'playlist-nordic-seed',
      _type: 'playlist',
      title: 'Nordic seed playlist',
      slug: slug('nordic-seed-playlist'),
      description: [block('Fictional playlist for development.', 'pl-desc')],
      songs: [keyedRef('song-aurora-line', 'pl-s1'), keyedRef('song-harbor-light', 'pl-s2')],
      countries: [keyedRef('country-fi', 'pl-c1'), keyedRef('country-se', 'pl-c2')],
      genres: [keyedRef('genre-worship', 'pl-g1')],
      editorialStatus: 'draft',
    },
    {
      _id: 'article-harbor-in-helsinki',
      _type: 'article',
      title: 'Cedar Harbor announced for Helsinki',
      slug: slug('cedar-harbor-announced-for-helsinki'),
      articleType: 'news',
      author: 'Seed Editor',
      publishedAt: '2026-01-20T09:00:00.000Z',
      excerpt:
        'Fictional news item showing a US artist booked at a Finnish venue without changing artist country associations.',
      body: [
        block(
          'Cedar Harbor, a fictional US artist, is scheduled to perform at Kallio Gospel House in Helsinki. The concert location is Finland. The artist country association remains the United States.',
          'art-body-1',
        ),
      ],
      relatedArtists: [keyedRef('artist-cedar-harbor', 'art-a1')],
      relatedReleases: [keyedRef('release-harbor-light', 'art-r1')],
      relatedSongs: [keyedRef('song-harbor-light', 'art-s1')],
      relatedEvents: [keyedRef('event-cedar-harbor-helsinki', 'art-e1')],
      relatedFestivals: [keyedRef('festival-baltic-faith', 'art-f1')],
      relatedCountries: [keyedRef('country-fi', 'art-c1'), keyedRef('country-us', 'art-c2')],
      relatedGenres: [keyedRef('genre-pop', 'art-g1')],
      sources: [
        {
          _type: 'sourceReference',
          _key: 'art-src',
          label: 'Fictional promoter announcement',
          url: 'https://example.com/events/cedar-harbor-helsinki',
        },
      ],
    },
  ]

  const transaction = client.transaction()
  for (const document of documents) {
    transaction.createOrReplace(document)
  }

  transaction.patch('song-aurora-line', (patch) =>
    patch.set({associatedReleases: [keyedRef('release-aurora-line', 'al-rel')]}),
  )
  transaction.patch('song-harbor-light', (patch) =>
    patch.set({associatedReleases: [keyedRef('release-harbor-light', 'hl-rel')]}),
  )
  transaction.patch('country-fi', (patch) =>
    patch.set({
      featuredArtists: [keyedRef('artist-northern-lights', 'fi-fa1')],
      featuredPlaylist: ref('playlist-nordic-seed'),
    }),
  )

  await transaction.commit({visibility: 'async'})
  console.log(`Seeded ${documents.length} documents into ${projectId}/${dataset}.`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
