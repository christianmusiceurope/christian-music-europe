import {defineField, defineType} from 'sanity'

export const streamingLinks = defineType({
  name: 'streamingLinks',
  title: 'Official links',
  type: 'object',
  fields: [
    defineField({
      name: 'spotify',
      title: 'Spotify URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'appleMusic',
      title: 'Apple Music URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'other',
      title: 'Other official links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'otherLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        },
      ],
    }),
  ],
})
