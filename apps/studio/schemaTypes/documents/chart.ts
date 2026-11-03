import {defineField, defineType} from 'sanity'
import {editorialGroup, geographyGroup, identityGroup, seoGroup} from '../constants'
import {uniqueSlug} from '../validation'

export const chart = defineType({
  name: 'chart',
  title: 'Chart',
  type: 'document',
  groups: [identityGroup, geographyGroup, editorialGroup, seoGroup],
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
      name: 'periodLabel',
      title: 'Chart period',
      type: 'string',
      group: 'identity',
      description: 'For example 2026-W40 or October 2026.',
    }),
    defineField({
      name: 'periodStart',
      title: 'Period start',
      type: 'date',
      group: 'identity',
    }),
    defineField({
      name: 'periodEnd',
      title: 'Period end',
      type: 'date',
      group: 'identity',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'reference',
      group: 'geography',
      to: [{type: 'country'}],
      description: 'Optional. Leave empty for a pan-European or global chart.',
    }),
    defineField({
      name: 'entries',
      title: 'Ranked entries',
      type: 'array',
      group: 'editorial',
      of: [{type: 'chartEntry'}],
      description: 'Ordered ranking. Do not create a separate document per position.',
    }),
    defineField({
      name: 'methodology',
      title: 'Ranking methodology',
      type: 'text',
      rows: 4,
      group: 'editorial',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      group: 'identity',
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
      period: 'periodLabel',
      country: 'country.name',
      publishedAt: 'publishedAt',
    },
    prepare({title, period, country, publishedAt}) {
      return {
        title,
        subtitle: [period, country, publishedAt ? String(publishedAt).slice(0, 10) : undefined]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
