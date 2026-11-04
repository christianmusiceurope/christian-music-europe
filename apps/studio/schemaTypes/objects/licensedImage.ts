import {defineField, defineType} from 'sanity'
import {IMAGE_LICENCES, IMAGE_RIGHTS_STATUSES, IMAGE_SOURCE_TYPES} from '../constants'
import {validateImageCredit, validateImageExpiry, validateImageRightsStatus} from '../validation'

export const licensedImage = defineType({
  name: 'licensedImage',
  title: 'Licensed image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Short description of what is in the photo, for someone who cannot see it. Required before publish.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'credit',
      title: 'Credit',
      type: 'string',
      description: 'Photographer or rights holder, written as it should appear on the site.',
      validation: (rule) =>
        rule
          .custom((credit, context) => {
            const licence = (context.parent as {licence?: string} | undefined)?.licence
            return validateImageCredit(typeof credit === 'string' ? credit : undefined, licence)
          })
          .warning(),
    }),
    defineField({
      name: 'sourceType',
      title: 'Source type',
      type: 'string',
      options: {list: [...IMAGE_SOURCE_TYPES], layout: 'dropdown'},
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Page where this photo was found, or the rights holder page.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'licence',
      title: 'Licence',
      type: 'string',
      options: {list: [...IMAGE_LICENCES], layout: 'dropdown'},
    }),
    defineField({
      name: 'permissionNotes',
      title: 'Permission notes',
      type: 'text',
      rows: 3,
      description:
        "Who gave permission and where the proof is kept. For example the Google Drive folder 'CME Media' or the 'CME Photo log' sheet.",
    }),
    defineField({
      name: 'expiresAt',
      title: 'Permission expires',
      type: 'date',
      description: 'Leave empty when the permission does not expire.',
      validation: (rule) =>
        rule
          .custom((expiresAt) => validateImageExpiry(typeof expiresAt === 'string' ? expiresAt : undefined))
          .warning(),
    }),
    defineField({
      name: 'rightsStatus',
      title: 'Rights status',
      type: 'string',
      options: {list: [...IMAGE_RIGHTS_STATUSES], layout: 'radio'},
      initialValue: 'unknown',
      description: 'The public site shows a photo only when this is Cleared.',
      validation: (rule) =>
        rule
          .custom((status) => validateImageRightsStatus(typeof status === 'string' ? status : undefined))
          .warning(),
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'credit',
      media: 'asset',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Licensed image',
        subtitle: subtitle || 'No credit yet',
        media,
      }
    },
  },
})
