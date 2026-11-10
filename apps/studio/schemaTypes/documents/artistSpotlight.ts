import {StarIcon} from '@sanity/icons/Star'
import {defineField, defineType} from 'sanity'

export const artistSpotlight = defineType({
  name: 'artistSpotlight',
  title: 'Artist Spotlight',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'reference',
      to: [{type: 'artist'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      description:
        'The homepage shows this spotlight from this day (Europe/Helsinki). You can set a future date to plan ahead. The newest start date that has already arrived is the one that appears.',
      options: {dateFormat: 'YYYY-MM-DD'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Optional. If empty, the site uses the artist name.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description:
        'Optional, one or two sentences. If empty, the site uses the first paragraph of the artist biography.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'licensedImage',
      description: 'Optional. If empty, the site uses the main licensed image on the artist when it is cleared.',
    }),
    defineField({
      name: 'relatedPostTitle',
      title: 'Related post title',
      type: 'string',
      description: 'Optional. Shown only when both a title and a URL are set.',
      validation: (rule) =>
        rule.custom((title, context) => {
          const url = (context.document as {relatedPostUrl?: string} | undefined)?.relatedPostUrl
          if (url && !String(title ?? '').trim()) {
            return 'Add a related post title, or clear the URL.'
          }
          return true
        }),
    }),
    defineField({
      name: 'relatedPostUrl',
      title: 'Related post URL',
      type: 'url',
      description: 'Link to the related article or social post. Optional.',
      validation: (rule) => [
        rule.uri({scheme: ['http', 'https']}),
        rule.custom((url, context) => {
          const title = (context.document as {relatedPostTitle?: string} | undefined)?.relatedPostTitle
          if (String(title ?? '').trim() && !url) {
            return 'Add the related post URL, or clear the title.'
          }
          return true
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Start date, newest first',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'artist.name',
      startDate: 'startDate',
      media: 'image',
      artistImage: 'artist.image',
    },
    prepare({title, startDate, media, artistImage}) {
      return {
        title: title || 'Artist Spotlight',
        subtitle: startDate || 'No start date',
        media: media || artistImage,
      }
    },
  },
})
