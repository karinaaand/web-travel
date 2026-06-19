import { CalendarDays, MessageSquare, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { getMediaUrl } from '../../lib/strapi';
import type { Article } from '../../lib/types';

function pickCover(article: { cover_image_url?: string; cover?: unknown }) {
  if (article.cover_image_url) return getMediaUrl(article.cover_image_url);
  const cover = article.cover as { url?: string } | Array<{ url?: string }> | undefined;
  if (Array.isArray(cover) && cover[0]?.url) return getMediaUrl(cover[0].url);
  if (cover && typeof cover === 'object' && 'url' in cover && typeof cover.url === 'string') return getMediaUrl(cover.url);
  return '';
}

function formatPublishDate(value?: string | null) {
  if (!value) return 'Tanggal belum tersedia';
  return new Date(value).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getCommentCount(article: Article) {
  return article.comments?.length ?? 0;
}

export function ArticlePreviewCard({ article, actionLabel }: { article: Article; actionLabel: string }) {
  return (
    <Card className="group h-full overflow-hidden border-white/70 bg-white/92 shadow-[0_24px_60px_rgba(31,42,46,0.06)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(31,42,46,0.12)]">
      <div className="relative aspect-4/3 overflow-hidden">
        <div className="h-full w-full bg-linear-to-br from-stone-200 to-orange-100 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]" style={pickCover(article) ? { backgroundImage: `url(${pickCover(article)})` } : undefined} />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/10 via-transparent to-transparent" />
        <div className="absolute right-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-900 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
          {article.category?.name ?? 'Travel'}
        </div>
      </div>

      <CardContent className="flex h-full flex-1 flex-col p-4 sm:p-6">
        <div className="flex min-h-[7.75rem] flex-col gap-2 sm:min-h-[8.5rem]">
          <h2 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold tracking-tight text-slate-950 sm:min-h-[3.5rem] sm:text-xl">{article.title}</h2>
          <p className="line-clamp-3 min-h-[4.75rem] text-sm leading-6 text-slate-600 sm:min-h-[5.25rem] sm:text-base sm:leading-7">
            {article.description ?? 'Cerita perjalanan yang membantu pembaca menangkap suasana destinasi sebelum benar-benar datang.'}
          </p>
        </div>

        <div className="mt-4 grid min-h-[4.75rem] gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:mt-5 sm:grid-cols-[minmax(0,1.2fr)_auto] sm:items-start">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="inline-flex min-w-0 items-center gap-2">
              <UserRound className="h-4 w-4 shrink-0" />
              <span className="truncate">{article.author?.username ?? 'Unknown Author'}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span>{getCommentCount(article)}</span>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 sm:justify-self-end">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">{formatPublishDate(article.publishedAt)}</span>
          </div>
        </div>

        <Button asChild variant="secondary" className="mt-4 w-full rounded-2xl sm:mt-5">
          <Link to={`/article/${article.documentId}`}>{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
