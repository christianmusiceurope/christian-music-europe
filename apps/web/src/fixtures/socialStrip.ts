import type { ArticleCard, EventCard, SocialPostCard } from '../lib/types';

/**
 * Local visual fixtures for /dev/social-strip/preview/ only.
 * They are not CMS documents and must not be treated as real posts or dates.
 */
export const placeholderPosts: SocialPostCard[] = [
  {
    id: 'fixture-post-1',
    platform: 'instagram',
    url: '#',
    postedAt: '2026-11-08T12:00:00Z',
    captionExcerpt: 'Placeholder caption for a CME Instagram post. One or two lines of text will appear here.',
  },
  {
    id: 'fixture-post-2',
    platform: 'tiktok',
    url: '#',
    postedAt: '2026-11-06T12:00:00Z',
    captionExcerpt: 'Placeholder caption for a CME TikTok post. The real caption is added when the post is linked.',
  },
  {
    id: 'fixture-post-3',
    platform: 'youtube',
    url: '#',
    postedAt: '2026-11-04T12:00:00Z',
    captionExcerpt: 'Placeholder caption for a CME YouTube post. No video title or claim is shown in this preview.',
  },
  {
    id: 'fixture-post-4',
    platform: 'x',
    url: '#',
    postedAt: '2026-11-02T12:00:00Z',
    captionExcerpt: 'Placeholder caption for a CME post on X. The real text is pulled in later.',
  },
];

export const placeholderEvents: EventCard[] = [
  {
    id: 'fixture-event-1',
    title: 'Placeholder event name',
    startDateTime: '2026-12-01T19:00:00+01:00',
    timezone: 'Europe/Berlin',
    eventStatus: 'scheduled',
    ticketStatus: 'on_sale',
    ticketUrl: '#',
    venueName: 'Placeholder venue',
    city: 'Placeholder city',
  },
  {
    id: 'fixture-event-2',
    title: 'Placeholder event name',
    startDateTime: '2026-12-05T19:00:00+01:00',
    timezone: 'Europe/Berlin',
    eventStatus: 'scheduled',
    ticketStatus: 'on_sale',
    ticketUrl: '#',
    venueName: 'Placeholder venue',
    city: 'Placeholder city',
  },
];

export const placeholderFeature: ArticleCard = {
  id: 'fixture-feature-1',
  title: 'Placeholder feature title',
  slug: undefined,
  articleType: 'feature',
  excerpt: 'Placeholder excerpt for a feature article about the artist. Real title, date and text come from an article document.',
  publishedAt: '2026-10-20T12:00:00Z',
};
