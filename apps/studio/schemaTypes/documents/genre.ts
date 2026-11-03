import {defineField, defineType} from 'sanity'
import {catalogGroup, editorialGroup, identityGroup, seoGroup} from '../constants'
import {uniqueSlug} from '../validation'

export const genre = defineType({
  name: 'genre',
  title: 'Genre',
  type: 'document',
  groups: [identityGroup, catalogGroup, editorialGroup, seoGroup],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'name', maxLength: 96, isUnique: uniqueSlug},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'editorial',
      description:
        'Christian music is the editorial scope of the platform, not a single genre value.',
    }),
    defineField({
      name: 'parentGenre',
      title: 'Parent genre',
      type: 'reference',
      group: 'catalog',
      to: [{type: 'genre'}],
      description: 'Optional hierarchy. Avoid deep or circular parent chains.',
      validation: (rule) =>
        rule.custom((value: {_ref?: string} | undefined, context) => {
          const documentId = context.document?._id?.replace(/^drafts\./, '')
          if (value?._ref && documentId && value._ref === documentId) {
            return 'A genre cannot be its own parent'
          }
          return true
        }),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'editorial',
      options: {hotspot: true},
    }),
    defineField({
      name: 'seo',
      title: 'SEO metadata',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'parentGenre.name', media: 'image'},
  },
})
