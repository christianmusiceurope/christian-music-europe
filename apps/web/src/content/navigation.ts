export type NavItem = {
  id: string;
  label: string;
  hash: string;
};

export const homeNav: NavItem[] = [
  { id: 'home', label: 'Home', hash: '' },
  { id: 'news', label: 'News', hash: 'latest' },
  { id: 'features', label: 'Features', hash: 'features' },
  { id: 'interviews', label: 'Interviews', hash: 'interviews' },
  { id: 'reviews', label: 'Reviews', hash: 'reviews' },
  { id: 'releases', label: 'New releases', hash: 'releases' },
  { id: 'countries', label: 'Countries', hash: 'countries' },
  { id: 'discovery', label: 'Discovery Lab', hash: 'discovery-lab' },
  { id: 'live', label: 'Live', hash: 'live' },
];

export const compactNav: NavItem[] = homeNav.filter((item) => item.id !== 'home');

export const swipeNav: NavItem[] = [
  { id: 'home', label: 'Home', hash: '' },
  { id: 'news', label: 'News', hash: 'latest' },
  { id: 'features', label: 'Features', hash: 'features' },
  { id: 'interviews', label: 'Interviews', hash: 'interviews' },
  { id: 'releases', label: 'Releases', hash: 'releases' },
  { id: 'countries', label: 'Countries', hash: 'countries' },
  { id: 'live', label: 'Live', hash: 'live' },
];

export const menuNav: NavItem[] = [
  { id: 'home', label: 'Home', hash: '' },
  { id: 'news', label: 'News', hash: 'latest' },
  { id: 'features', label: 'Features', hash: 'features' },
  { id: 'interviews', label: 'Interviews', hash: 'interviews' },
  { id: 'reviews', label: 'Reviews', hash: 'reviews' },
  { id: 'releases', label: 'New releases', hash: 'releases' },
  { id: 'discovery', label: 'Discovery Lab', hash: 'discovery-lab' },
  { id: 'live', label: 'Live in Europe', hash: 'live' },
];

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
  if (!item.hash) return '/';
  return onHome ? `#${item.hash}` : `/#${item.hash}`;
}
