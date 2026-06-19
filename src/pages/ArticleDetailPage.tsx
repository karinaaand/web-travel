import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Share2, SquarePen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ErrorText } from '../components/ui/ErrorText';
import { CommentsSection } from '../features/comments/components/CommentsSection';
import { useArticleQuery } from '../features/articles/store/articleQueries';
import { useAuthStore } from '../features/auth/store/authStore';
import { getMediaUrl } from '../lib/strapi';

function pickCover(article: { cover_image_url?: string; cover?: unknown }) {
  if (article.cover_image_url) return getMediaUrl(article.cover_image_url);
  const cover = article.cover as { url?: string } | Array<{ url?: string }> | undefined;
  if (Array.isArray(cover) && cover[0]?.url) return getMediaUrl(cover[0].url);
  if (cover && typeof cover === 'object' && 'url' in cover && typeof cover.url === 'string') return getMediaUrl(cover.url);
  return '';
}

export function ArticleDetailPage() {
  const { documentId } = useParams();
  const articleQuery = useArticleQuery(documentId);
  const selectedArticle = articleQuery.data;
  const { token, user } = useAuthStore();

  const cover = selectedArticle ? pickCover(selectedArticle) : '';
  const canEditArticle = Boolean(token && user && selectedArticle?.author?.id === user.id);

  const contentBlocks = useMemo(() => {
    if (!selectedArticle?.content) return [];
    return selectedArticle.content.split(/\n{2,}/).filter(Boolean);
  }, [selectedArticle?.content]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: selectedArticle?.title ?? 'Travel Article',
        text: selectedArticle?.description ?? 'Baca artikel travel ini',
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
    window.alert('Link artikel berhasil disalin.');
  };

  return (
    <section className="page">
      <div className="container flex flex-col gap-6 sm:gap-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-900">
              Detail Artikel
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Detail artikel destinasi</h1>
          </div>
          <Button asChild variant="secondary" className="w-full rounded-2xl sm:w-auto">
            <Link to="/home">Kembali ke artikel</Link>
          </Button>
        </div>

        <ErrorText message={articleQuery.error instanceof Error ? articleQuery.error.message : null} />

        {articleQuery.isLoading ? <Card><CardContent className="p-6 text-sm text-slate-500">Memuat detail artikel...</CardContent></Card> : null}

        {!articleQuery.isLoading && selectedArticle ? (
          <>
            <Card className="border-white/70 bg-white/92">
              <div
                className="min-h-[360px] bg-linear-to-br from-teal-900 via-teal-700 to-orange-300 bg-cover bg-center sm:min-h-[460px]"
                style={cover ? { backgroundImage: `linear-gradient(180deg, rgba(7, 24, 29, 0.16), rgba(7, 24, 29, 0.82)), url(${cover})` } : undefined}
              >
                <div className="flex min-h-[360px] flex-col justify-end gap-5 p-4 text-white sm:min-h-[460px] sm:gap-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                      {selectedArticle.category?.name ?? 'Travel Story'}
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                      {selectedArticle.location ?? 'Lokasi belum tersedia'}
                    </span>
                  </div>
                  <div className="max-w-4xl space-y-3 sm:space-y-4">
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">{selectedArticle.title}</h2>
                    <p className="max-w-3xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                      {selectedArticle.description ?? 'Artikel ini membahas destinasi, suasana lokal, dan insight perjalanan yang relevan bagi pembaca.'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button type="button" variant="secondary" onClick={() => void handleShare()} className="w-full rounded-2xl sm:w-auto">
                      <Share2 className="h-4 w-4" />
                      Bagikan artikel
                    </Button>
                    {canEditArticle ? (
                      <Button asChild variant="outline" className="w-full rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto">
                        <Link to={`/edit/${selectedArticle.documentId}`}>
                          <SquarePen className="h-4 w-4" />
                          Edit artikel
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <Card className="border-white/70 bg-white/92">
                <CardHeader>
                  <CardTitle>Cerita perjalanan lengkap</CardTitle>
                  <CardDescription>Konten utama artikel travel yang kini punya ritme baca lebih nyaman di desktop maupun mobile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {contentBlocks.slice(0, 4).map((block, index) => (
                    <p key={index} className="whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-[15px] sm:leading-8">{block}</p>
                  ))}
                  {contentBlocks.length > 4 ? (
                    <details className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                      <summary className="cursor-pointer text-sm font-semibold text-slate-900">Muat konten lainnya</summary>
                      <div className="mt-4 space-y-5">
                        {contentBlocks.slice(4).map((block, index) => (
                          <p key={`more-${index}`} className="whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-[15px] sm:leading-8">{block}</p>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <Card variant="soft">
                  <CardContent className="space-y-2 p-6">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-500"><MapPin className="h-4 w-4" />Lokasi</p>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedArticle.location ?? 'Tidak tersedia'}</h3>
                  </CardContent>
                </Card>
                <Card variant="warm">
                  <CardContent className="space-y-2 p-6">
                    <p className="text-sm font-medium text-slate-500">Kategori</p>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedArticle.category?.name ?? 'Tidak tersedia'}</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="space-y-2 p-6">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-500"><CalendarDays className="h-4 w-4" />Tanggal publish</p>
                    <p className="text-sm leading-6 text-slate-700">
                      {selectedArticle.publishedAt
                        ? new Date(selectedArticle.publishedAt).toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'Belum dipublikasikan'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-white/70 bg-white/92">
              <CardContent className="p-6 sm:p-7">
                <CommentsSection articleId={selectedArticle.documentId} />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </section>
  );
}
