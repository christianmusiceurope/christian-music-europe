import {defineField, defineType} from 'sanity'
import {editorialGroup, geographyGroup, identityGroup} from '../constants'
import {uniqueSlug} from '../validation'

export const venue = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  groups: [identityGroup, geographyGroup, editorialGroup],
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
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'geography',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'reference',
      group: 'geography',
      to: [{type: 'country'}],
      validation: (rule) => rule.required(),
      description: 'Event geography is derived from this venue country, not from performing artists.',
    }),
    defineField({
      name: 'streetAddress',
      title: 'Street address',
      type: 'string',
      group: 'geography',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal code',
      type: 'string',
      group: 'geography',
    }),
    defineField({
      name: 'location',
      title: 'Geographic coordinates',
      type: 'geopoint',
      group: 'geography',
    }),
    defineField({
      name: 'website',
      title: 'Official website',
      type: 'url',
      group: 'identity',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'portableText',
      group: 'editorial',
    }),
    defineField({
      name: 'image',
      title: 'Venue image',
      type: 'image',
      group: 'editorial',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'name',
      city: 'city',
      country: 'country.name',
      media: 'image',
    },
    prepare({title, city, country, media}) {
      return {
        title,
        subtitle: [city, country].filter(Boolean).join(', '),
        media,
      }
    },
  },
})
