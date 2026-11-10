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

export type LicensedImage = {
  url?: string;
  alt?: string;
  credit?: string;
  sourceType?: string;
  sourceUrl?: string;
  licence?: string;
  permissionNotes?: string;
  expiresAt?: string;
  rightsStatus?: string;
};

export type PtImageBlock = LicensedImage & {
  _key?: string;
  _type: 'image' | 'licensedImage';
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
  heroImage?: LicensedImage;
};

export type ReleaseCard = {
  id: string;
  title: string;
  slug?: string;
  releaseType?: string;
  releaseDate?: string;
  cover?: LicensedImage;
};

export type EventCard = {
  id: string;
  title: string;
  slug?: string;
  startDateTime?: string;
  timezone?: string;
  eventType?: string;
  eventStatus?: string;
  ticketStatus?: string;
  ticketUrl?: string;
  officialSourceUrl?: string;
  city?: string;
  countryName?: string;
  venueName?: string;
  festivalName?: string;
  festivalSlug?: string;
  festivalWebsite?: string;
  /** Local fixture copy of unpublished draft data. */
  development?: boolean;
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
  tourUrl?: string;
  spotifyArtistId?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  image?: LicensedImage;
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
  heroImage?: LicensedImage;
  body: PortableTextBlock[];
  artists: Array<{ name: string; slug?: string }>;
  countries: Array<{ name: string; slug?: string }>;
  genres: Array<{ name: string; slug?: string }>;
  releases: Array<{ title: string; slug?: string; releaseType?: string }>;
};

export type SpotlightView = {
  startDateLabel: string;
  headline: string;
  intro?: string;
  artistSlug: string;
  countries: string[];
  genres: string[];
  image?: LicensedImage;
  relatedPost?: { title: string; url: string };
};
