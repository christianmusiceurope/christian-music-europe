import {defineField, defineType} from 'sanity'

export const youtubeEmbed = defineType({
  name: 'youtubeEmbed',
  title: 'YouTube embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
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
