export const ARTIST_TYPES = [
  {title: 'Solo', value: 'solo'},
  {title: 'Band', value: 'band'},
  {title: 'Collective', value: 'collective'},
] as const

export const COUNTRY_RELATIONSHIP_TYPES = [
  {title: 'Origin', value: 'origin'},
  {title: 'Formed in', value: 'formed_in'},
  {title: 'Based in', value: 'based_in'},
  {title: 'Active in', value: 'active_in'},
  {title: 'Heritage', value: 'heritage'},
  {title: 'Other', value: 'other'},
] as const

export const EUROPEAN_REGIONS = [
  {title: 'Nordic', value: 'nordic'},
  {title: 'Western Europe', value: 'western_europe'},
  {title: 'Central Europe', value: 'central_europe'},
  {title: 'Southern Europe', value: 'southern_europe'},
  {title: 'Eastern Europe', value: 'eastern_europe'},
  {title: 'Not applicable', value: 'not_applicable'},
] as const

export const INCLUSION_STATUSES = [
  {title: 'In scope', value: 'in_scope'},
  {title: 'Needs review', value: 'needs_review'},
  {title: 'Borderline', value: 'borderline'},
  {title: 'Out of scope', value: 'out_of_scope'},
] as const

export const RELEASE_TYPES = [
  {title: 'Album', value: 'album'},
  {title: 'EP', value: 'ep'},
  {title: 'Single', value: 'single'},
] as const

export const EVENT_TYPES = [
  {title: 'Concert', value: 'concert'},
  {title: 'Festival', value: 'festival'},
  {title: 'Worship night', value: 'worship_night'},
  {title: 'Showcase', value: 'showcase'},
  {title: 'Other', value: 'other'},
] as const

export const EVENT_STATUSES = [
  {title: 'Scheduled', value: 'scheduled'},
  {title: 'Postponed', value: 'postponed'},
  {title: 'Cancelled', value: 'cancelled'},
  {title: 'Completed', value: 'completed'},
] as const

export const TICKET_STATUSES = [
  {title: 'Unknown', value: 'unknown'},
  {title: 'Announced', value: 'announced'},
  {title: 'On sale', value: 'on_sale'},
  {title: 'Sold out', value: 'sold_out'},
] as const

export const ARTICLE_TYPES = [
  {title: 'News', value: 'news'},
  {title: 'Interview', value: 'interview'},
  {title: 'Review', value: 'review'},
  {title: 'Feature', value: 'feature'},
] as const

export const PLAYLIST_STATUSES = [
  {title: 'Draft', value: 'draft'},
  {title: 'Ready', value: 'ready'},
  {title: 'Published', value: 'published'},
  {title: 'Archived', value: 'archived'},
] as const

export const CAMPAIGN_TYPES = [
  {title: 'Artist spotlight', value: 'artist_spotlight'},
  {title: 'Release', value: 'release'},
  {title: 'Event', value: 'event'},
  {title: 'Playlist', value: 'playlist'},
  {title: 'Article', value: 'article'},
  {title: 'Other', value: 'other'},
] as const

export const CAMPAIGN_STATUSES = [
  {title: 'Draft', value: 'draft'},
  {title: 'Review', value: 'review'},
  {title: 'Approved', value: 'approved'},
  {title: 'Scheduled', value: 'scheduled'},
  {title: 'Published', value: 'published'},
] as const

export const CHANNELS = [
  {title: 'Website', value: 'website'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'TikTok', value: 'tiktok'},
  {title: 'X', value: 'x'},
  {title: 'YouTube', value: 'youtube'},
] as const

export const CHANNEL_APPROVAL_STATUSES = [
  {title: 'Draft', value: 'draft'},
  {title: 'Review', value: 'review'},
  {title: 'Approved', value: 'approved'},
  {title: 'Scheduled', value: 'scheduled'},
  {title: 'Published', value: 'published'},
] as const

export const IMAGE_SOURCE_TYPES = [
  {title: 'Official promo', value: 'official_promo'},
  {title: 'Given by artist or label', value: 'given_by_artist_or_label'},
  {title: 'Own photo', value: 'own_photo'},
  {title: 'Free licence', value: 'free_licence'},
  {title: 'Other', value: 'other'},
] as const

export const IMAGE_LICENCES = [
  {title: 'All rights reserved, with permission', value: 'all_rights_reserved_with_permission'},
  {title: 'CC0', value: 'cc0'},
  {title: 'CC BY', value: 'cc_by'},
  {title: 'CC BY-SA', value: 'cc_by_sa'},
  {title: 'Unsplash', value: 'unsplash'},
  {title: 'Pexels', value: 'pexels'},
  {title: 'Other', value: 'other'},
] as const

export const IMAGE_RIGHTS_STATUSES = [
  {title: 'Unknown', value: 'unknown'},
  {title: 'Cleared', value: 'cleared'},
  {title: 'Restricted', value: 'restricted'},
  {title: 'Not cleared', value: 'not_cleared'},
] as const

export const MEDIA_RIGHTS_STATUSES = [
  {title: 'Unknown', value: 'unknown'},
  {title: 'Cleared', value: 'cleared'},
  {title: 'Restricted', value: 'restricted'},
  {title: 'Do not use', value: 'do_not_use'},
] as const

export const VERIFICATION_STATUSES = [
  {title: 'Unverified', value: 'unverified'},
  {title: 'Verified', value: 'verified'},
  {title: 'Needs recapture', value: 'needs_recapture'},
] as const

export const ISO_ALPHA2 = /^[A-Z]{2}$/

export const identityGroup = {name: 'identity', title: 'Identity', default: true}
export const catalogGroup = {name: 'catalog', title: 'Catalog'}
export const geographyGroup = {name: 'geography', title: 'Geography'}
export const editorialGroup = {name: 'editorial', title: 'Editorial'}
export const verificationGroup = {name: 'verification', title: 'Verification'}
export const seoGroup = {name: 'seo', title: 'SEO'}
