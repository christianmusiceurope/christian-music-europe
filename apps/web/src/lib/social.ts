import { squareSocialImage } from './images';
import type { ArticleCard, EventCard, SocialPlatform, SocialPostCard } from './types';

export const SOCIAL_PLATFORMS: SocialPlatform[] = ['instagram', 'tiktok', 'x', 'youtube', 'facebook'];

export const socialPlatformLabels: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  x: 'X',
  youtube: 'YouTube',
  facebook: 'Facebook',
};

export const WIDE_POST_LIMIT = 4;

/** Footer Follow column. The site does not yet publish official CME channel URLs. */
export const FOLLOW_CME_HREF = '#follow-cme';

export type SocialLayout = 'hidden' | 'pair' | 'wide';

export function isSocialPlatform(value: string | undefined): value is SocialPlatform {
  return Boolean(value && (SOCIAL_PLATFORMS as string[]).includes(value));
}

export function platformLabel(platform: string | undefined): string {
  if (isSocialPlatform(platform)) return socialPlatformLabels[platform];
  return 'Social';
}

export function socialLayout(count: number): SocialLayout {
  if (count <= 0) return 'hidden';
  if (count <= 2) return 'pair';
  return 'wide';
}

export type Companion =
  | { kind: 'events'; events: EventCard[] }
  | { kind: 'feature'; article: ArticleCard }
  | { kind: 'follow' };

/** Priority: upcoming dates, then the newest feature article, then Follow CME. */
export function resolveCompanion(input: {
  events?: EventCard[];
  articles?: ArticleCard[];
}): Companion {
  const upcoming = (input.events ?? []).filter((event) => event.eventStatus !== 'cancelled');
  if (upcoming.length > 0) {
    return { kind: 'events', events: upcoming.slice(0, 4) };
  }
  const feature = (input.articles ?? []).find((article) => article.articleType === 'feature' && article.title);
  if (feature) {
    return { kind: 'feature', article: feature };
  }
  return { kind: 'follow' };
}

export function relatedPostFromSocial(post: {
  url?: string | null;
  captionExcerpt?: string | null;
  platform?: string | null;
} | null | undefined): { title: string; url: string } | undefined {
  const url = post?.url?.trim();
  if (!url) return undefined;
  const caption = post?.captionExcerpt?.trim();
  const title =
    caption && caption.length <= 80 ? caption : `View on ${platformLabel(post?.platform ?? undefined)}`;
  return { title, url };
}

export type RawSocialPost = {
  _id?: string;
  platform?: string;
  url?: string;
  postedAt?: string;
  captionExcerpt?: string;
  spotlight?: boolean;
  coverImage?: { url?: string; alt?: string } | null;
};

export function mapSocialPost(raw: RawSocialPost | null | undefined): SocialPostCard | undefined {
  if (!raw?._id || !raw.url || !isSocialPlatform(raw.platform)) return undefined;
  const coverUrl = raw.coverImage?.url;
  return {
    id: raw._id,
    platform: raw.platform,
    url: raw.url,
    postedAt: raw.postedAt,
    captionExcerpt: raw.captionExcerpt?.trim() || undefined,
    spotlight: Boolean(raw.spotlight),
    coverImage: coverUrl
      ? { url: squareSocialImage(coverUrl), alt: raw.coverImage?.alt?.trim() || undefined }
      : undefined,
  };
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
