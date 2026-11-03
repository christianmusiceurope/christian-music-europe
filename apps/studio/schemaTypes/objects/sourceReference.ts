import {defineField, defineType} from 'sanity'

export const sourceReference = defineType({
  name: 'sourceReference',
  title: 'Source',
  type: 'object',
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
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'accessedAt',
      title: 'Accessed at',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'url'},
  },
})
