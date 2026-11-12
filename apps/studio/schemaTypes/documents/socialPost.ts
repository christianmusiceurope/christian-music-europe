import {ShareIcon} from '@sanity/icons/Share'
import {defineField, defineType} from 'sanity'

export const SOCIAL_PLATFORMS = [
  {title: 'Instagram', value: 'instagram'},
  {title: 'TikTok', value: 'tiktok'},
  {title: 'X', value: 'x'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Facebook', value: 'facebook'},
] as const

export const socialPost = defineType({
  name: 'socialPost',
  title: 'Social Post',
  type: 'document',
  icon: ShareIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {list: [...SOCIAL_PLATFORMS], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Post URL',
      type: 'url',
      description: 'Link to the public post on the platform.',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      description:
        'Artists tagged or featured in this post. The post appears on those artist pages.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'postedAt',
      title: 'Posted at',
      type: 'datetime',
      description: 'When the post went live on the platform.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'captionExcerpt',
      title: 'Caption excerpt',
      type: 'text',
      rows: 3,
      description: 'A short excerpt from the post caption, shown on the site.',
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Short description of the image, for someone who cannot see it.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              if (parent?.asset && !String(alt ?? '').trim()) {
                return 'Add alt text for the cover image.'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'spotlight',
      title: 'Use as spotlight related post',
      type: 'boolean',
      description:
        'When the current Artist Spotlight for this artist has no related post URL, the newest post marked here is used as the related post. If none is marked, the newest post for that artist is used.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Posted date, newest first',
      name: 'postedAtDesc',
      by: [{field: 'postedAt', direction: 'desc'}],
    },
    {
      title: 'Platform',
      name: 'platformAsc',
      by: [
        {field: 'platform', direction: 'asc'},
        {field: 'postedAt', direction: 'desc'},
      ],
    },
  ],
  preview: {
    select: {
      caption: 'captionExcerpt',
      platform: 'platform',
      postedAt: 'postedAt',
      media: 'coverImage',
      artist: 'artists.0.name',
    },
    prepare({caption, platform, postedAt, media, artist}) {
      const platformLabel =
        SOCIAL_PLATFORMS.find((item) => item.value === platform)?.title ||
        platform ||
        'Social Post'
      const when = postedAt ? String(postedAt).slice(0, 10) : undefined
      return {
        title: String(caption ?? '').trim() || platformLabel,
        subtitle: [platformLabel, when, artist].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
