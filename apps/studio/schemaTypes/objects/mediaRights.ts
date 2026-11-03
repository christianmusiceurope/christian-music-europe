import {defineField, defineType} from 'sanity'
import {MEDIA_RIGHTS_STATUSES} from '../constants'

export const mediaRights = defineType({
  name: 'mediaRights',
  title: 'Media rights',
  type: 'object',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: [...MEDIA_RIGHTS_STATUSES]},
      initialValue: 'unknown',
    }),
    defineField({
      name: 'owner',
      title: 'Rights owner',
      type: 'string',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expiry',
      type: 'date',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
})
