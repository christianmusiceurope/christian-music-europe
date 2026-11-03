import {defineField, defineType} from 'sanity'
import {VERIFICATION_STATUSES} from '../constants'

export const editorialVerification = defineType({
  name: 'editorialVerification',
  title: 'Editorial verification',
  type: 'object',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: [...VERIFICATION_STATUSES]},
      initialValue: 'unverified',
    }),
    defineField({
      name: 'lastVerifiedAt',
      title: 'Last verified',
      type: 'datetime',
    }),
    defineField({
      name: 'verifiedBy',
      title: 'Verified by',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
})
