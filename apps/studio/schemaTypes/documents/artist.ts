import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  ARTIST_TYPES,
  catalogGroup,
  editorialGroup,
  geographyGroup,
  identityGroup,
  INCLUSION_STATUSES,
  seoGroup,
  verificationGroup,
} from '../constants'
import {uniqueSlug, validateCountryAssociations, validateSocialHost} from '../validation'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  groups: [
    identityGroup,
    geographyGroup,
    catalogGroup,
    editorialGroup,
    verificationGroup,
    seoGroup,
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'name', maxLength: 96, isUnique: uniqueSlug},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artistType',
      title: 'Artist type',
      type: 'string',
      group: 'identity',
      options: {list: [...ARTIST_TYPES], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'countryAssociations',
      title: 'Country associations',
      type: 'array',
      group: 'geography',
      of: [{type: 'countryAssociation'}],
      description:
        'Unlimited associations. At most one may be primary. Never infer nationality or origin from event locations.',
      validation: (rule) =>
        rule.custom((value: Array<{country?: {_ref?: string}; primary?: boolean}> | undefined) =>
          validateCountryAssociations(value),
        ),
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'genre'}]}],
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      group: 'catalog',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'portableText',
      group: 'editorial',
    }),
    defineField({
      name: 'image',
      title: 'Artist image',
      type: 'licensedImage',
      group: 'editorial',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'editorial',
      of: [defineArrayMember({type: 'licensedImage'})],
    }),
    defineField({
      name: 'website',
      title: 'Official website',
      type: 'url',
      group: 'catalog',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'tourUrl',
      title: 'Tour / dates URL',
      type: 'url',
      group: 'catalog',
      description: "Official page that lists this artist's upcoming dates. Prefer this over website when searching for shows.",
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'spotifyArtistId',
      title: 'Spotify artist ID',
      type: 'string',
      group: 'catalog',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'catalog',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'catalog',
      validation: (rule) => [
        rule.uri({scheme: ['http', 'https']}),
        rule.custom((value) => validateSocialHost(typeof value === 'string' ? value : undefined, ['instagram.com'])).warning(),
      ],
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
      group: 'catalog',
      validation: (rule) => [
        rule.uri({scheme: ['http', 'https']}),
        rule.custom((value) => validateSocialHost(typeof value === 'string' ? value : undefined, ['tiktok.com'])).warning(),
      ],
    }),
    defineField({
      name: 'xUrl',
      title: 'X URL',
      type: 'url',
      group: 'catalog',
      description: 'twitter.com links are fine.',
      validation: (rule) => [
        rule.uri({scheme: ['http', 'https']}),
        rule
          .custom((value) =>
            validateSocialHost(typeof value === 'string' ? value : undefined, ['x.com', 'twitter.com']),
          )
          .warning(),
      ],
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      group: 'catalog',
      validation: (rule) => [
        rule.uri({scheme: ['http', 'https']}),
        rule
          .custom((value) =>
            validateSocialHost(typeof value === 'string' ? value : undefined, ['facebook.com', 'fb.com']),
          )
          .warning(),
      ],
    }),
    defineField({
      name: 'musicBrainzId',
      title: 'MusicBrainz ID',
      type: 'string',
      group: 'catalog',
    }),
    defineField({
      name: 'inclusionStatus',
      title: 'Editorial inclusion status',
      type: 'string',
      group: 'editorial',
      options: {list: [...INCLUSION_STATUSES]},
      initialValue: 'needs_review',
      description:
        'Editorial classification for the Christian music ecosystem. Never treat this as an assertion of an individual’s religious identity.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal editorial notes',
      type: 'text',
      group: 'editorial',
      rows: 4,
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      group: 'verification',
      of: [{type: 'sourceReference'}],
    }),
    defineField({
      name: 'verification',
      title: 'Verification',
      type: 'editorialVerification',
      group: 'verification',
    }),
    defineField({
      name: 'seo',
      title: 'SEO metadata',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      artistType: 'artistType',
      inclusionStatus: 'inclusionStatus',
      media: 'image',
    },
    prepare({title, artistType, inclusionStatus, media}) {
      return {
        title,
        subtitle: [artistType, inclusionStatus].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
