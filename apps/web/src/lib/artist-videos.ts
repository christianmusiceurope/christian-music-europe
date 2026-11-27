import type { ArtistVideo } from './types';
import { youtubeVideoId } from './youtube';

export type VideoEmbedInput = { _key?: string; url?: string; title?: string } | null | undefined;

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value.filter((item) => item != null) : [];
}

function mapVideoEmbeds(embeds: Array<VideoEmbedInput> | null | undefined): ArtistVideo[] {
  return asArray(embeds).flatMap((embed) => {
    if (!embed?.url) return [];
    const id = youtubeVideoId(embed.url);
    if (!id) return [];
    return [
      {
        key: embed._key ?? id,
        url: embed.url,
        title: embed.title?.trim() || '',
      },
    ];
  });
}

function dedupeVideos(videos: ArtistVideo[]): ArtistVideo[] {
  const seen = new Set<string>();
  return videos.filter((video) => {
    const id = youtubeVideoId(video.url) ?? video.url;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/** Curated Studio videos first, then article embeds, deduped by YouTube video id. Biography embeds are omitted. */
export function collectArtistVideos(input: {
  curated?: Array<VideoEmbedInput> | null;
  articleGroups?: Array<{ embeds?: Array<VideoEmbedInput> | null } | null> | null;
}): ArtistVideo[] {
  const curated = mapVideoEmbeds(input.curated);
  const fromArticles = asArray(input.articleGroups).flatMap((group) => mapVideoEmbeds(group?.embeds));
  return dedupeVideos([...curated, ...fromArticles]);
}
