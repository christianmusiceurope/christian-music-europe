const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Returns a YouTube video id, or null for channel links and placeholder ids. */
export function youtubeVideoId(url: string | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = parsed.pathname.split('/').filter(Boolean)[0] ?? null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/watch') {
      id = parsed.searchParams.get('v');
    } else {
      const [kind, value] = parsed.pathname.split('/').filter(Boolean);
      if (value && (kind === 'embed' || kind === 'shorts' || kind === 'live' || kind === 'v')) {
        id = value;
      }
    }
  }

  if (!id || !YOUTUBE_ID.test(id)) return null;
  return id;
}

export function youtubeEmbedSrc(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
}

const SPOTIFY_PATH = /^\/(artist|album|track|playlist|episode|show)\/([A-Za-z0-9]+)/;

export function spotifyEmbedSrc(input: { url?: string; artistId?: string }): string | null {
  if (input.artistId && /^[A-Za-z0-9]+$/.test(input.artistId)) {
    return `https://open.spotify.com/embed/artist/${input.artistId}`;
  }
  if (!input.url) return null;
  try {
    const parsed = new URL(input.url);
    if (parsed.hostname !== 'open.spotify.com') return null;
    const match = parsed.pathname.match(SPOTIFY_PATH);
    if (!match) return null;
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  } catch {
    return null;
  }
}

export function spotifyArtistUrl(artistId: string | undefined): string | undefined {
  if (!artistId || !/^[A-Za-z0-9]+$/.test(artistId)) return undefined;
  return `https://open.spotify.com/artist/${artistId}`;
}
