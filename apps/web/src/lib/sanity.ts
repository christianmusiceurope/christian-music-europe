import { createClient, type SanityClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2026-10-25';

export const isSanityConfigured = Boolean(
  projectId && projectId !== 'yourProjectId',
);

export const sanityClient: SanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
});

export type ArtistCard = {
  _id: string;
  name: string;
  slug?: { current?: string };
  summary?: string;
};

export type ReleaseCard = {
  _id: string;
  title: string;
  slug?: { current?: string };
  summary?: string;
};

export type EventCard = {
  _id: string;
  title: string;
  slug?: { current?: string };
  city?: string;
  country?: string;
  startDate?: string;
  summary?: string;
};

export async function fetchDiscoveryPreview(): Promise<{
  artists: ArtistCard[];
  releases: ReleaseCard[];
  events: EventCard[];
}> {
  if (!isSanityConfigured) {
    return { artists: [], releases: [], events: [] };
  }

  try {
    const [artists, releases, events] = await Promise.all([
      sanityClient.fetch<ArtistCard[]>(
        `*[_type == "artist"] | order(name asc)[0...6]{ _id, name, slug, summary }`,
      ),
      sanityClient.fetch<ReleaseCard[]>(
        `*[_type == "release"] | order(releaseDate desc)[0...6]{ _id, title, slug, summary }`,
      ),
      sanityClient.fetch<EventCard[]>(
        `*[_type == "event"] | order(startDate asc)[0...6]{ _id, title, slug, city, country, startDate, summary }`,
      ),
    ]);

    return { artists, releases, events };
  } catch (error) {
    console.warn('Sanity fetch failed. Check projectId, dataset, and CORS.', error);
    return { artists: [], releases: [], events: [] };
  }
}
