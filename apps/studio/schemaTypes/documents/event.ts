import {defineField, defineType} from 'sanity'
import {
  editorialGroup,
  EVENT_STATUSES,
  EVENT_TYPES,
  geographyGroup,
  identityGroup,
  seoGroup,
  TICKET_STATUSES,
  verificationGroup,
} from '../constants'
import {uniqueSlug} from '../validation'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [identityGroup, geographyGroup, editorialGroup, verificationGroup, seoGroup],
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
      name: 'eventType',
      title: 'Event type',
      type: 'string',
      group: 'identity',
      options: {list: [...EVENT_TYPES]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start date/time',
      type: 'datetime',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End date/time',
      type: 'datetime',
      group: 'identity',
      validation: (rule) =>
        rule.custom((end: string | undefined, context) => {
          const start = (context.document as {startDateTime?: string} | undefined)
            ?.startDateTime
          if (end && start && end < start) {
            return 'End date/time must be after the start date/time'
          }
          return true
        }),
    }),
    defineField({
      name: 'timezone',
      title: 'IANA timezone',
      type: 'string',
      group: 'identity',
      description: 'Example: Europe/Helsinki or America/New_York.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventStatus',
      title: 'Event status',
      type: 'string',
      group: 'identity',
      options: {list: [...EVENT_STATUSES]},
      initialValue: 'scheduled',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ticketStatus',
      title: 'Ticket status',
      type: 'string',
      group: 'identity',
      options: {list: [...TICKET_STATUSES]},
      initialValue: 'unknown',
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Official ticket URL',
      type: 'url',
      group: 'identity',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'performingArtists',
      title: 'Performing artists',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      description:
        'International artists may perform in Europe. Do not classify an artist as European because they appear here.',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'reference',
      group: 'geography',
      to: [{type: 'venue'}],
      validation: (rule) => rule.required(),
      description: 'Event geography comes from the venue location only.',
    }),
    defineField({
      name: 'festival',
      title: 'Festival series',
      type: 'reference',
      group: 'identity',
      to: [{type: 'festival'}],
      description: 'Set this for an annual edition of a recurring festival.',
    }),
    defineField({
      name: 'description',
      title: 'Event description',
      type: 'portableText',
      group: 'editorial',
    }),
    defineField({
      name: 'image',
      title: 'Event image',
      type: 'licensedImage',
      group: 'editorial',
    }),
    defineField({
      name: 'officialSourceUrl',
      title: 'Official source URL',
      type: 'url',
      group: 'verification',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'lastVerifiedAt',
      title: 'Last verified',
      type: 'datetime',
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
      date: 'startDateTime',
      venue: 'venue.name',
      city: 'venue.city',
      media: 'image',
    },
    prepare({title, date, venue, city, media}) {
      const when = date ? String(date).slice(0, 10) : 'no date'
      return {
        title,
        subtitle: [when, venue, city].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
