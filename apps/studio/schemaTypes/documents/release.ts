import {defineField, defineType} from 'sanity'
import {
  catalogGroup,
  editorialGroup,
  identityGroup,
  RELEASE_TYPES,
  seoGroup,
  verificationGroup,
} from '../constants'
import {uniqueSlug} from '../validation'

export const release = defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  groups: [identityGroup, catalogGroup, editorialGroup, verificationGroup, seoGroup],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'title', maxLength: 96, isUnique: uniqueSlug},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'releaseType',
      title: 'Release type',
      type: 'string',
      group: 'identity',
      options: {list: [...RELEASE_TYPES], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primaryArtist',
      title: 'Primary artist',
      type: 'reference',
      group: 'catalog',
      to: [{type: 'artist'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'additionalArtists',
      title: 'Additional artists',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release date',
      type: 'date',
      group: 'catalog',
    }),
    defineField({
      name: 'coverArtwork',
      title: 'Cover artwork',
      type: 'image',
      group: 'editorial',
      options: {hotspot: true},
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
      name: 'trackListing',
      title: 'Track listing',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'song'}]}],
      description: 'Canonical ordered track list for this release.',
    }),
    defineField({
      name: 'links',
      title: 'Official links',
      type: 'streamingLinks',
      group: 'catalog',
    }),
    defineField({
      name: 'identifiers',
      title: 'External identifiers',
      type: 'externalIdentifiers',
      group: 'catalog',
    }),
    defineField({
      name: 'description',
      title: 'Editorial description',
      type: 'portableText',
      group: 'editorial',
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
      title: 'title',
      artist: 'primaryArtist.name',
      date: 'releaseDate',
      releaseType: 'releaseType',
      media: 'coverArtwork',
    },
    prepare({title, artist, date, releaseType, media}) {
      return {
        title,
        subtitle: [releaseType, artist, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
