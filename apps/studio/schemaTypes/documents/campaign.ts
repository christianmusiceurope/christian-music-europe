import {defineField, defineType} from 'sanity'
import {
  CAMPAIGN_STATUSES,
  CAMPAIGN_TYPES,
  editorialGroup,
  identityGroup,
  verificationGroup,
} from '../constants'
import {uniqueSlug} from '../validation'

export const campaign = defineType({
  name: 'campaign',
  title: 'Campaign',
  type: 'document',
  groups: [identityGroup, editorialGroup, verificationGroup],
  fields: [
    defineField({
      name: 'name',
      title: 'Campaign name',
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
    }),
    defineField({
      name: 'campaignType',
      title: 'Campaign type',
      type: 'string',
      group: 'identity',
      options: {list: [...CAMPAIGN_TYPES]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'relatedArtists',
      title: 'Related artists',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'relatedReleases',
      title: 'Related releases',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'release'}]}],
    }),
    defineField({
      name: 'relatedSongs',
      title: 'Related songs',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'song'}]}],
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related articles',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'article'}]}],
    }),
    defineField({
      name: 'relatedEvents',
      title: 'Related events',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: [{type: 'event'}]}],
    }),
    defineField({
      name: 'campaignStatus',
      title: 'Campaign status',
      type: 'string',
      group: 'identity',
      options: {list: [...CAMPAIGN_STATUSES]},
      initialValue: 'draft',
      description:
        'Publishing workflow. This does not replace Sanity draft/published documents.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'channelContent',
      title: 'Channel-specific content',
      type: 'array',
      group: 'editorial',
      of: [{type: 'channelContent'}],
      description:
        'Website, Instagram, TikTok, X, and YouTube copy. No social APIs are connected yet.',
    }),
    defineField({
      name: 'scheduledAt',
      title: 'Scheduled publishing date',
      type: 'datetime',
      group: 'identity',
    }),
    defineField({
      name: 'publishingResults',
      title: 'Publishing results and URLs',
      type: 'array',
      group: 'verification',
      of: [
        {
          type: 'object',
          name: 'publishingResult',
          fields: [
            defineField({name: 'channel', title: 'Channel', type: 'string'}),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.uri({scheme: ['http', 'https']}),
            }),
            defineField({name: 'publishedAt', title: 'Published at', type: 'datetime'}),
            defineField({name: 'notes', title: 'Notes', type: 'string'}),
          ],
          preview: {
            select: {title: 'channel', subtitle: 'url'},
          },
        },
      ],
    }),
    defineField({
      name: 'mediaRights',
      title: 'Media rights',
      type: 'mediaRights',
      group: 'verification',
    }),
    defineField({
      name: 'sources',
      title: 'Source verification',
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
      name: 'internalNotes',
      title: 'Internal editorial notes',
      type: 'text',
      group: 'editorial',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      status: 'campaignStatus',
      type: 'campaignType',
    },
    prepare({title, status, type}) {
      return {
        title,
        subtitle: [type, status].filter(Boolean).join(' · '),
      }
    },
  },
})
