import {defineField, defineType} from 'sanity'

export const seoMetadata = defineType({
  name: 'seoMetadata',
  title: 'SEO metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Overrides the document title in search results when set.',
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Share image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
