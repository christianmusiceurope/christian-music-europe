import type { HomeSections } from '../lib/home';

export type NavItem = {
  id: string;
  label: string;
  hash: string;
  /** Absolute path for items that are their own page rather than a homepage section. */
  href?: string;
  /** Only shown when this homepage block renders. */
  requires?: keyof HomeSections;
};

/**
 * Navigation links only to blocks that render. News, Features, Interviews and
 * Reviews come back as article types once articles are published and have
 * their own index pages; until then "Articles" appears when the homepage
 * Latest articles block has something to show.
 */
const sections: NavItem[] = [
  { id: 'releases', label: 'New releases', hash: 'releases', requires: 'releases' },
  { id: 'live', label: 'Live', hash: 'live', requires: 'live' },
  { id: 'channels', label: 'From our channels', hash: 'from-our-channels', requires: 'channels' },
  { id: 'articles', label: 'Articles', hash: 'articles', requires: 'articles' },
  { id: 'countries', label: 'Countries', hash: 'countries', href: '/countries/' },
];

export const homeNav: NavItem[] = [{ id: 'home', label: 'Home', hash: '' }, ...sections];

export const compactNav: NavItem[] = sections;

export const swipeNav: NavItem[] = [
  { id: 'home', label: 'Home', hash: '' },
  { id: 'releases', label: 'Releases', hash: 'releases', requires: 'releases' },
  { id: 'live', label: 'Live', hash: 'live', requires: 'live' },
  { id: 'channels', label: 'Channels', hash: 'from-our-channels', requires: 'channels' },
  { id: 'articles', label: 'Articles', hash: 'articles', requires: 'articles' },
  { id: 'countries', label: 'Countries', hash: 'countries', href: '/countries/' },
];

export const menuNav: NavItem[] = [
  { id: 'home', label: 'Home', hash: '' },
  { id: 'releases', label: 'New releases', hash: 'releases', requires: 'releases' },
  { id: 'live', label: 'Live in Europe', hash: 'live', requires: 'live' },
  { id: 'channels', label: 'From our channels', hash: 'from-our-channels', requires: 'channels' },
  { id: 'articles', label: 'Latest articles', hash: 'articles', requires: 'articles' },
  { id: 'countries', label: 'Countries', hash: 'countries', href: '/countries/' },
];

export function visibleNav(items: NavItem[], available: HomeSections): NavItem[] {
  return items.filter((item) => !item.requires || available[item.requires]);
}

export const previewCountries = [
  'Austria',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'Netherlands',
  'Norway',
  'Portugal',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom',
] as const;

export function sectionHref(item: NavItem, onHome: boolean, current: string | undefined, pathname: string): string {
  if (current && item.id === current) return pathname || '/';
  if (item.href) return item.href;
  if (!item.hash) return '/';
  return onHome ? `#${item.hash}` : `/#${item.hash}`;
}
