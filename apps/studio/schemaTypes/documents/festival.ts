import {defineField, defineType} from 'sanity'
import {
  catalogGroup,
  editorialGroup,
  geographyGroup,
  identityGroup,
  seoGroup,
} from '../constants'
import {uniqueSlug, validateCountryAssociations} from '../validation'

export const festival = defineType({
  name: 'festival',
  title: 'Festival',
  type: 'document',
  groups: [identityGroup, geographyGroup, catalogGroup, editorialGroup, seoGroup],
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
      name: 'description',
      title: 'Description',
      type: 'portableText',
      group: 'editorial',
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'website',
      title: 'Official website',
      type: 'url',
      group: 'identity',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'countryAssociations',
      title: 'Country associations',
      type: 'array',
      group: 'geography',
      of: [{type: 'countryAssociation'}],
      validation: (rule) =>
        rule.custom((value: Array<{country?: {_ref?: string}; primary?: boolean}> | undefined) =>
          validateCountryAssociations(value),
        ),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
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
      name: 'seo',
      title: 'SEO metadata',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      organizer: 'organizer',
      media: 'heroImage',
    },
    prepare({title, organizer, media}) {
      return {
        title,
        subtitle: organizer ? `Series · ${organizer}` : 'Recurring festival series',
        media,
      }
    },
  },
})
