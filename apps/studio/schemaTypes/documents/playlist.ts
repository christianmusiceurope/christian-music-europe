import {defineField, defineType} from 'sanity'
import {
  editorialGroup,
  identityGroup,
  PLAYLIST_STATUSES,
  seoGroup,
} from '../constants'
import {uniqueSlug} from '../validation'

export const playlist = defineType({
  name: 'playlist',
  title: 'Playlist',
  type: 'document',
  groups: [identityGroup, editorialGroup, seoGroup],
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
      name: 'description',
      title: 'Description',
      type: 'portableText',
      group: 'editorial',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'licensedImage',
      group: 'editorial',
    }),
    defineField({
      name: 'songs',
      title: 'Songs',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'song'}]}],
      description: 'Ordered playlist. Drag to reorder.',
    }),
    defineField({
      name: 'countries',
      title: 'Countries',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'country'}]}],
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'genre'}]}],
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify playlist URL',
      type: 'url',
      group: 'editorial',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube playlist URL',
      type: 'url',
      group: 'editorial',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'editorialStatus',
      title: 'Editorial status',
      type: 'string',
      group: 'editorial',
      options: {list: [...PLAYLIST_STATUSES]},
      initialValue: 'draft',
      description: 'Business workflow. Does not replace Sanity draft/published.',
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
      status: 'editorialStatus',
      media: 'coverImage',
    },
    prepare({title, status, media}) {
      return {title, subtitle: status, media}
    },
  },
})
