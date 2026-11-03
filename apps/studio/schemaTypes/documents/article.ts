import {defineField, defineType} from 'sanity'
import {
  ARTICLE_TYPES,
  catalogGroup,
  editorialGroup,
  identityGroup,
  seoGroup,
  verificationGroup,
} from '../constants'
import {uniqueSlug} from '../validation'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [identityGroup, editorialGroup, catalogGroup, verificationGroup, seoGroup],
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
      name: 'articleType',
      title: 'Article type',
      type: 'string',
      group: 'identity',
      options: {list: [...ARTICLE_TYPES]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      group: 'identity',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated date',
      type: 'datetime',
      group: 'identity',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'editorial',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'editorial',
      options: {hotspot: true},
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      group: 'editorial',
      description: 'Supports headings, quotes, links, images, and Spotify/YouTube embeds.',
    }),
    defineField({
      name: 'relatedArtists',
      title: 'Related artists',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'relatedReleases',
      title: 'Related releases',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'release'}]}],
    }),
    defineField({
      name: 'relatedSongs',
      title: 'Related songs',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'song'}]}],
    }),
    defineField({
      name: 'relatedEvents',
      title: 'Related events',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'event'}]}],
    }),
    defineField({
      name: 'relatedFestivals',
      title: 'Related festivals',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'festival'}]}],
    }),
    defineField({
      name: 'relatedCountries',
      title: 'Related countries',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'country'}]}],
    }),
    defineField({
      name: 'relatedGenres',
      title: 'Related genres',
      type: 'array',
      group: 'catalog',
      of: [{type: 'reference', to: [{type: 'genre'}]}],
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      group: 'verification',
      of: [{type: 'sourceReference'}],
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
      articleType: 'articleType',
      publishedAt: 'publishedAt',
      media: 'heroImage',
    },
    prepare({title, articleType, publishedAt, media}) {
      return {
        title,
        subtitle: [articleType, publishedAt ? String(publishedAt).slice(0, 10) : undefined]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
