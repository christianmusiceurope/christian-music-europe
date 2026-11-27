import {defineField, defineType} from 'sanity'
import {validateYoutubeVideoUrl} from '../validation'

export const youtubeEmbed = defineType({
  name: 'youtubeEmbed',
  title: 'YouTube embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (rule) => [
        rule.required().uri({scheme: ['http', 'https']}),
        rule.custom((value) => validateYoutubeVideoUrl(typeof value === 'string' ? value : undefined)),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'url'},
    prepare({title, subtitle}) {
      return {title: title || 'YouTube embed', subtitle}
    },
  },
})
