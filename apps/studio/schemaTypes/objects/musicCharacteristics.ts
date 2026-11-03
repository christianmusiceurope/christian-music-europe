import {defineField, defineType} from 'sanity'

export const musicCharacteristics = defineType({
  name: 'musicCharacteristics',
  title: 'Music characteristics',
  type: 'object',
  description:
    'Editorial tags for future matching. Do not treat these as an automated recommendation engine.',
  fields: [
    defineField({
      name: 'moodTags',
      title: 'Mood tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'energyLevel',
      title: 'Energy level',
      type: 'number',
      description: '1 is the quietest; 5 is the most energetic.',
      validation: (rule) => rule.min(1).max(5).integer(),
    }),
    defineField({
      name: 'vocalStyle',
      title: 'Vocal style',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'instrumentation',
      title: 'Instrumentation',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'productionCharacteristics',
      title: 'Production characteristics',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'musicalInfluences',
      title: 'Musical influences',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'similarityNotes',
      title: 'Editorial similarity notes',
      type: 'text',
      rows: 3,
    }),
  ],
})
