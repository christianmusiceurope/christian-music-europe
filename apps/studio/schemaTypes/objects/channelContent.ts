import {defineField, defineType} from 'sanity'
import {CHANNEL_APPROVAL_STATUSES, CHANNELS} from '../constants'

export const channelContent = defineType({
  name: 'channelContent',
  title: 'Channel content',
  type: 'object',
  fields: [
    defineField({
      name: 'channel',
      title: 'Channel',
      type: 'string',
      options: {list: [...CHANNELS]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'videoScript',
      title: 'Video script',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'visualBrief',
      title: 'Visual brief',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'mediaAssets',
      title: 'Media assets',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'approvalStatus',
      title: 'Approval status',
      type: 'string',
      options: {list: [...CHANNEL_APPROVAL_STATUSES]},
      initialValue: 'draft',
      description:
        'Channel workflow only. This does not replace Sanity draft/published state.',
    }),
    defineField({
      name: 'scheduledAt',
      title: 'Scheduled publishing time',
      type: 'datetime',
    }),
    defineField({
      name: 'externalPublishingId',
      title: 'External publishing ID',
      type: 'string',
    }),
    defineField({
      name: 'publishedUrl',
      title: 'Published URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'channel',
      subtitle: 'approvalStatus',
    },
  },
})
