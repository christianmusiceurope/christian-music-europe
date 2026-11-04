import {defineField, defineType} from 'sanity'
import {
  editorialGroup,
  EUROPEAN_REGIONS,
  geographyGroup,
  identityGroup,
  seoGroup,
} from '../constants'
import {uniqueSlug, validateIsoCountryCode} from '../validation'

export const country = defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  groups: [identityGroup, geographyGroup, editorialGroup, seoGroup],
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
      name: 'isoCode',
      title: 'ISO 3166-1 alpha-2 code',
      type: 'string',
      group: 'identity',
      description: 'World coverage. Use uppercase codes such as FI, US, or BR.',
      validation: (rule) =>
        rule.required().custom((value: string | undefined) => validateIsoCountryCode(value)),
    }),
    defineField({
      name: 'europeanEditorialScope',
      title: 'European editorial scope',
      type: 'boolean',
      group: 'geography',
      initialValue: false,
      description:
        'Marks whether this country is in the European editorial focus. Non-European countries remain valid for artists and world coverage.',
    }),
    defineField({
      name: 'europeanRegion',
      title: 'European region',
      type: 'string',
      group: 'geography',
      options: {list: [...EUROPEAN_REGIONS]},
    }),
    defineField({
      name: 'description',
      title: 'Country description',
      type: 'portableText',
      group: 'editorial',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'licensedImage',
      group: 'editorial',
    }),
    defineField({
      name: 'featuredArtists',
      title: 'Featured artists',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      description:
        'Editorial highlights only. Artist country associations are the source of truth for origin and activity.',
    }),
    defineField({
      name: 'featuredPlaylist',
      title: 'Featured playlist',
      type: 'reference',
      group: 'editorial',
      to: [{type: 'playlist'}],
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
      isoCode: 'isoCode',
      european: 'europeanEditorialScope',
      media: 'heroImage',
    },
    prepare({title, isoCode, european, media}) {
      return {
        title,
        subtitle: `${isoCode || 'no code'}${european ? ' · European scope' : ''}`,
        media,
      }
    },
  },
  orderings: [
    {title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
  ],
})
