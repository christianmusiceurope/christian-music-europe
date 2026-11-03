import {defineField, defineType} from 'sanity'

export const chartEntry = defineType({
  name: 'chartEntry',
  title: 'Chart entry',
  type: 'object',
  fields: [
    defineField({
      name: 'rank',
      title: 'Rank',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'song',
      title: 'Song',
      type: 'reference',
      to: [{type: 'song'}],
    }),
    defineField({
      name: 'release',
      title: 'Release',
      type: 'reference',
      to: [{type: 'release'}],
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
    }),
  ],
  validation: (rule) =>
    rule.custom((value: {song?: {_ref?: string}; release?: {_ref?: string}} | undefined) => {
      if (!value?.song && !value?.release) {
        return 'Each ranking needs a song or a release'
      }
      return true
    }),
  preview: {
    select: {
      rank: 'rank',
      song: 'song.title',
      release: 'release.title',
    },
    prepare({rank, song, release}) {
      return {
        title: `#${rank ?? '?'} ${song || release || 'Untitled'}`,
      }
    },
  },
})
