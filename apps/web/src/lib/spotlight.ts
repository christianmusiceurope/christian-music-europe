import { formatDateOnly, todayInHelsinki } from './dates';
import { relatedPostFromSocial } from './social';
import { imageForHero } from './images';
import { contentSource, CURRENT_SPOTLIGHT_QUERY, sanityClient } from './sanity';
import { firstParagraph } from './text';
import type { LicensedImage, PortableTextBlock, SpotlightView } from './types';

export type SpotlightRecord = {
  _id?: string;
  headline?: string | null;
  intro?: string | null;
  startDate?: string | null;
  relatedPostTitle?: string | null;
  relatedPostUrl?: string | null;
  fallbackSocialPost?: {
    platform?: string | null;
    url?: string | null;
    captionExcerpt?: string | null;
    postedAt?: string | null;
    spotlight?: boolean | null;
  } | null;
  image?: LicensedImage | null;
  artist?: {
    _id?: string;
    name?: string;
    slug?: string;
    biography?: PortableTextBlock[] | null;
    image?: LicensedImage | null;
    countryAssociations?: Array<{
      country?: { name?: string; slug?: string } | null;
    } | null>;
    genres?: Array<{ _id?: string; name?: string; slug?: string } | null>;
  } | null;
};

export function pickCurrentSpotlight<T extends { startDate?: string | null }>(
  entries: T[],
  today: string,
): T | undefined {
  return entries
    .filter((entry) => typeof entry.startDate === 'string' && entry.startDate <= today)
    .sort((a, b) => {
      const dateCmp = (b.startDate || '').localeCompare(a.startDate || '');
      return dateCmp;
    })[0];
}

export function resolveSpotlight(raw: SpotlightRecord | null | undefined, today = todayInHelsinki()): SpotlightView | undefined {
  if (!raw?.artist?.name || !raw.artist.slug || !raw.startDate) return undefined;
  if (raw.startDate > today) return undefined;

  const startDateLabel = formatDateOnly(raw.startDate);
  if (!startDateLabel) return undefined;

  const headline = raw.headline?.trim() || raw.artist.name;
  const intro = raw.intro?.trim() || firstParagraph(raw.artist.biography ?? undefined) || undefined;
  const image = imageForHero(raw.image) || imageForHero(raw.artist.image);
  const countries = (raw.artist.countryAssociations ?? [])
    .map((association) => association?.country?.name?.trim())
    .filter((name): name is string => Boolean(name));
  const genres = (raw.artist.genres ?? [])
    .map((genre) => genre?.name?.trim())
    .filter((name): name is string => Boolean(name));

  const relatedTitle = raw.relatedPostTitle?.trim();
  const relatedUrl = raw.relatedPostUrl?.trim();
  const relatedPost =
    relatedTitle && relatedUrl
      ? { title: relatedTitle, url: relatedUrl }
      : relatedUrl
        ? undefined
        : relatedPostFromSocial(raw.fallbackSocialPost);

  return {
    startDateLabel,
    headline,
    intro,
    artistSlug: raw.artist.slug,
    countries,
    genres,
    image,
    relatedPost,
  };
}

async function fixtureSpotlight(): Promise<SpotlightView | undefined> {
  const { sondaeSpotlightFixture } = await import('../fixtures/spotlight');
  return resolveSpotlight(sondaeSpotlightFixture);
}

export async function getCurrentSpotlight(): Promise<SpotlightView | undefined> {
  if (contentSource === 'fixture' || import.meta.env.PUBLIC_CME_SPOTLIGHT_FIXTURE === 'true') {
    return fixtureSpotlight();
  }

  try {
    const today = todayInHelsinki();
    const raw = await sanityClient.fetch<SpotlightRecord | null>(CURRENT_SPOTLIGHT_QUERY, { today });
    return resolveSpotlight(raw, today);
  } catch (error) {
    console.warn('Artist Spotlight query failed; using the cover fallback.', error);
    return undefined;
  }
}
