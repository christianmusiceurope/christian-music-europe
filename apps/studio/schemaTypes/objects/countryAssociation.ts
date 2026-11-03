import {defineField, defineType} from 'sanity'
import {COUNTRY_RELATIONSHIP_TYPES} from '../constants'

export const countryAssociation = defineType({
  name: 'countryAssociation',
  title: 'Country association',
  type: 'object',
  fields: [
    defineField({
      name: 'country',
      title: 'Country',
      type: 'reference',
      to: [{type: 'country'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'relationshipType',
      title: 'Relationship',
      type: 'string',
      options: {list: [...COUNTRY_RELATIONSHIP_TYPES], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primary',
      title: 'Primary association',
      type: 'boolean',
      initialValue: false,
      description:
        'Optional. At most one primary association is allowed. Never infer this from event locations.',
    }),
    defineField({
      name: 'note',
      title: 'Editorial note',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'country.name',
      relationshipType: 'relationshipType',
      primary: 'primary',
    },
    prepare({title, relationshipType, primary}) {
      return {
        title: title || 'Country',
        subtitle: `${relationshipType || 'relationship'}${primary ? ' · primary' : ''}`,
      }
    },
  },
})
