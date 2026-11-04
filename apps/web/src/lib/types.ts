export type ArtistType = 'solo' | 'band' | 'collective' | string;

export type PtSpan = {
  _key?: string;
  _type: 'span';
  text?: string;
  marks?: string[];
};

export type PtLinkMark = {
  _key: string;
  _type: 'link';
  href?: string;
};

export type PtTextBlock = {
  _key?: string;
  _type: 'block';
  style?: string;
  children?: PtSpan[];
  markDefs?: PtLinkMark[];
};

export type PtImageBlock = {
  _key?: string;
  _type: 'image';
  alt?: string;
  url?: string;
};

export type PtYouTubeBlock = {
  _key?: string;
  _type: 'youtubeEmbed';
  url?: string;
  title?: string;
};

export type PtSpotifyBlock = {
  _key?: string;
  _type: 'spotifyEmbed';
  url?: string;
  title?: string;
};

export type PortableTextBlock = PtTextBlock | PtImageBlock | PtYouTubeBlock | PtSpotifyBlock;

export type CountryAssociationView = {
  key: string;
  name: string;
  slug?: string;
  isoCode?: string;
  relationshipType: string;
  relationshipLabel: string;
  primary: boolean;
};

export type GenreView = {
  id: string;
  name: string;
  slug?: string;
};

export type SourceView = {
  key: string;
  label: string;
  url?: string;
  accessedAt?: string;
};

export type ArticleCard = {
  id: string;
  title: string;
  slug?: string;
  articleType?: string;
  excerpt?: string;
  publishedAt?: string;
  heroUrl?: string;
};

export type ReleaseCard = {
  id: string;
  title: string;
  slug?: string;
  releaseType?: string;
  releaseDate?: string;
  coverUrl?: string;
};

export type EventCard = {
  id: string;
  title: string;
  slug?: string;
  startDateTime?: string;
  eventType?: string;
  city?: string;
  countryName?: string;
  venueName?: string;
};

export type ArtistVideo = {
  key: string;
  url: string;
  title: string;
};

export type ArtistPageData = {
  id: string;
  name: string;
  slug: string;
  artistType: ArtistType;
  artistTypeLabel: string;
  languages: string[];
  biography: PortableTextBlock[];
  website?: string;
  spotifyArtistId?: string;
  youtubeUrl?: string;
  imageUrl?: string;
  countries: CountryAssociationView[];
  genres: GenreView[];
  articles: ArticleCard[];
  releases: ReleaseCard[];
  events: EventCard[];
  videos: ArtistVideo[];
  sources: SourceView[];
};

export type ArticleDocument = {
  id: string;
  title: string;
  slug: string;
  articleType?: string;
  author?: string;
  publishedAt?: string;
  excerpt?: string;
  heroUrl?: string;
  body: PortableTextBlock[];
  artists: Array<{ name: string; slug?: string }>;
  countries: Array<{ name: string; slug?: string }>;
  genres: Array<{ name: string; slug?: string }>;
  releases: Array<{ title: string; slug?: string; releaseType?: string }>;
};
