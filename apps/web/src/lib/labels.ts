const artistTypes: Record<string, string> = {
  solo: 'Solo',
  band: 'Band',
  collective: 'Collective',
};

const relationships: Record<string, string> = {
  origin: 'Origin',
  formed_in: 'Formed in',
  based_in: 'Based in',
  active_in: 'Active in',
  heritage: 'Heritage',
  other: 'Other',
};

export const articleTypes: Record<string, string> = {
  news: 'News',
  interview: 'Interview',
  review: 'Review',
  feature: 'Feature',
};

export const releaseTypes: Record<string, string> = {
  album: 'Album',
  ep: 'EP',
  single: 'Single',
};

export function labelFrom(map: Record<string, string>, value: string | undefined, fallback = ''): string {
  if (!value) return fallback;
  return map[value] ?? value.replaceAll('_', ' ');
}

export function artistTypeLabel(value: string | undefined): string {
  return labelFrom(artistTypes, value, 'Artist');
}

export function relationshipLabel(value: string | undefined): string {
  return labelFrom(relationships, value, 'Association');
}

export function articleTypeLabel(value: string | undefined): string {
  return labelFrom(articleTypes, value, 'Story');
}

export function releaseTypeLabel(value: string | undefined): string {
  return labelFrom(releaseTypes, value, 'Release');
}
