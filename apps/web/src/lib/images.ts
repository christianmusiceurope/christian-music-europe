import type { LicensedImage, PortableTextBlock } from './types';

/**
 * Restricted photos (permission still pending) are a development exception.
 * Production builds ignore the flag and only show cleared photos.
 * Dev and preview builds opt in with PUBLIC_CME_ALLOW_PENDING_IMAGES=true.
 */
export const allowPendingImages =
  import.meta.env.PUBLIC_CME_ALLOW_PENDING_IMAGES === 'true' && import.meta.env.MODE !== 'production';

/** Keep the full portrait (2500x3750, 2:3) and cap the download size. */
export function sizedSanityImage(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'cdn.sanity.io') return url;
    parsed.searchParams.set('w', '1400');
    parsed.searchParams.set('h', '2100');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('q', '80');
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Cleared photos always pass. Restricted photos pass only outside production when the flag is on. */
export function imageForSite(image: LicensedImage | null | undefined): LicensedImage | undefined {
  if (!image?.url) return undefined;
  if (image.rightsStatus === 'cleared' || (image.rightsStatus === 'restricted' && allowPendingImages)) {
    return { ...image, url: sizedSanityImage(image.url) };
  }
  return undefined;
}

export function presentPortableText(blocks: PortableTextBlock[] | null | undefined): PortableTextBlock[] {
  const list = Array.isArray(blocks) ? blocks : [];
  return list.flatMap((block) => {
    if (!block || (block._type !== 'image' && block._type !== 'licensedImage')) return block ? [block] : [];
    const image = imageForSite(block);
    if (!image) return [{ ...block, url: undefined }];
    return [{ ...block, ...image }];
  });
}
