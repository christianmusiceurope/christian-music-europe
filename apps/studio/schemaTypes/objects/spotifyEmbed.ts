import {defineField, defineType} from 'sanity'

export const spotifyEmbed = defineType({
  name: 'spotifyEmbed',
  title: 'Spotify embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Spotify URL',
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
      return {title: title || 'Spotify embed', subtitle}
    },
  },
})
