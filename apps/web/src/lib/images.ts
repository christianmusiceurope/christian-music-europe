import type { LicensedImage, PortableTextBlock } from './types';

/** Sanity photos are public only when an editor has marked them cleared. */
export function clearedForSite(image: LicensedImage | null | undefined): LicensedImage | undefined {
  if (!image?.url) return undefined;
  if (image.rightsStatus !== 'cleared') return undefined;
  return image;
}

export function presentPortableText(blocks: PortableTextBlock[] | undefined): PortableTextBlock[] {
  return (blocks ?? []).map((block) => {
    if (block._type !== 'image' && block._type !== 'licensedImage') return block;
    const image = clearedForSite(block);
    if (!image) return { ...block, url: undefined };
    return { ...block, ...image };
  });
}
