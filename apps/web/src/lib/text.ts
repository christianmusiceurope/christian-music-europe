import type { PortableTextBlock, PtTextBlock } from './types';

export function blockPlainText(block: PtTextBlock): string {
  return (block.children ?? []).map((child) => child?.text ?? '').join('');
}

export function portablePlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return '';
  return blocks
    .filter((block): block is PtTextBlock => block._type === 'block')
    .map((block) => blockPlainText(block).trim())
    .filter(Boolean)
    .join('\n\n');
}

export function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.!?](?:\s|$)/);
  return (match ? match[0] : text).trim();
}

export function headingsFromPortableText(blocks: PortableTextBlock[] | undefined): Array<{ id: string; text: string }> {
  if (!blocks) return [];
  const headings: Array<{ id: string; text: string }> = [];
  for (const block of blocks) {
    if (block._type !== 'block') continue;
    if (block.style !== 'h2' && block.style !== 'h3') continue;
    const text = blockPlainText(block).trim();
    if (!text || !block._key) continue;
    headings.push({ id: `h-${block._key}`, text });
  }
  return headings;
}

export function videosInPortableText(blocks: PortableTextBlock[] | undefined): Array<{ key: string; url: string; title: string }> {
  if (!blocks) return [];
  const videos: Array<{ key: string; url: string; title: string }> = [];
  for (const block of blocks) {
    if (block._type !== 'youtubeEmbed' || !block.url) continue;
    videos.push({
      key: block._key ?? block.url,
      url: block.url,
      title: block.title?.trim() || 'YouTube video',
    });
  }
  return videos;
}

export function firstParagraph(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return '';
  for (const block of blocks) {
    if (block._type !== 'block') continue;
    const text = blockPlainText(block).trim();
    if (text) return text;
  }
  return '';
}
