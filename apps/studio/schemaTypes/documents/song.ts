import {defineField, defineType} from 'sanity'
import {
  catalogGroup,
  editorialGroup,
  identityGroup,
  seoGroup,
  verificationGroup,
} from '../constants'
import {uniqueSlug} from '../validation'

export const song = defineType({
  name: 'song',
  title: 'Song',
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
      name: 'primaryArtist',
      title: 'Primary artist',
      type: 'reference',
      group: 'catalog',
      to: [{type: 'artist'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredArtists',
      title: 'Featured artists',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'associatedReleases',
      title: 'Associated releases',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'release'}]}],
      description:
        'Optional reverse links. Release track listings remain the canonical song order.',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release date',
      type: 'date',
      group: 'catalog',
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
      name: 'links',
      title: 'Streaming links',
      type: 'streamingLinks',
      group: 'catalog',
    }),
    defineField({
      name: 'characteristics',
      title: 'Music characteristics',
      type: 'musicCharacteristics',
      group: 'editorial',
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
    },
    prepare({title, artist, date}) {
      return {
        title,
        subtitle: [artist, date].filter(Boolean).join(' · '),
      }
    },
  },
})
