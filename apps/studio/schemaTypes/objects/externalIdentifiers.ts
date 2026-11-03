import {defineField, defineType} from 'sanity'

export const externalIdentifiers = defineType({
  name: 'externalIdentifiers',
  title: 'External identifiers',
  type: 'object',
  fields: [
    defineField({
      name: 'spotifyId',
      title: 'Spotify ID',
      type: 'string',
    }),
    defineField({
      name: 'appleMusicId',
      title: 'Apple Music ID',
      type: 'string',
    }),
    defineField({
      name: 'musicBrainzId',
      title: 'MusicBrainz ID',
      type: 'string',
    }),
    defineField({
      name: 'isrc',
      title: 'ISRC',
      type: 'string',
    }),
  ],
})
