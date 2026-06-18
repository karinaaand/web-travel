import { getMediaUrl } from './strapi';
import type { Article } from './types';

export function pickArticleCover(article: Pick<Article, 'cover_image_url' | 'cover'>) {
  if (article.cover_image_url) return getMediaUrl(article.cover_image_url);

  const cover = article.cover;

  if (Array.isArray(cover) && cover[0]?.url) return getMediaUrl(cover[0].url);

  if (cover && typeof cover === 'object' && 'url' in cover && typeof cover.url === 'string') {
    return getMediaUrl(cover.url);
  }

  return '';
}
