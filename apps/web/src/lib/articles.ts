import { clearedForSite, presentPortableText } from './images';
import { ARTICLE_BY_SLUG_QUERY, ARTICLE_SLUGS_QUERY, contentSource, sanityClient } from './sanity';
import type { ArticleDocument, LicensedImage, PortableTextBlock } from './types';

export const PLACEHOLDER_ARTICLE_SLUG = 'placeholder-interview';

type SanityArticle = {
  _id?: string;
  title?: string;
  slug?: string;
  articleType?: string;
  author?: string;
  publishedAt?: string;
  excerpt?: string;
  heroImage?: LicensedImage | null;
  body?: PortableTextBlock[];
  artists?: Array<{ name?: string; slug?: string } | null>;
  countries?: Array<{ name?: string; slug?: string } | null>;
  genres?: Array<{ name?: string; slug?: string } | null>;
  releases?: Array<{ title?: string; slug?: string; releaseType?: string } | null>;
};

export async function getArticleSlugs(): Promise<string[]> {
  const slugs = [PLACEHOLDER_ARTICLE_SLUG];
  if (contentSource !== 'sanity') return slugs;
  const rows = await sanityClient.fetch<Array<{ slug?: string }>>(ARTICLE_SLUGS_QUERY);
  for (const row of rows) {
    if (row.slug && !slugs.includes(row.slug)) slugs.push(row.slug);
  }
  return slugs;
}

export async function getArticle(slug: string): Promise<ArticleDocument | null> {
  if (contentSource !== 'sanity' || slug === PLACEHOLDER_ARTICLE_SLUG) return null;
  const doc = await sanityClient.fetch<SanityArticle | null>(ARTICLE_BY_SLUG_QUERY, { slug });
  if (!doc?.title || !doc.slug) return null;
  return {
    id: doc._id ?? doc.slug,
    title: doc.title,
    slug: doc.slug,
    articleType: doc.articleType,
    author: doc.author,
    publishedAt: doc.publishedAt,
    excerpt: doc.excerpt,
    heroImage: clearedForSite(doc.heroImage),
    body: presentPortableText(doc.body),
    artists: (doc.artists ?? []).flatMap((artist) => (artist?.name ? [{ name: artist.name, slug: artist.slug }] : [])),
    countries: (doc.countries ?? []).flatMap((country) => (country?.name ? [{ name: country.name, slug: country.slug }] : [])),
    genres: (doc.genres ?? []).flatMap((genre) => (genre?.name ? [{ name: genre.name, slug: genre.slug }] : [])),
    releases: (doc.releases ?? []).flatMap((release) =>
      release?.title ? [{ title: release.title, slug: release.slug, releaseType: release.releaseType }] : [],
    ),
  };
}
