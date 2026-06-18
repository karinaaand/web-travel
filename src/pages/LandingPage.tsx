import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useArticleStore } from '../features/articles/store/articleStore';
import { useArticlesQuery } from '../features/articles/store/articleQueries';
import { getMediaUrl } from '../lib/strapi';

function pickCover(article: { cover_image_url?: string; cover?: unknown }) {
  if (article.cover_image_url) return getMediaUrl(article.cover_image_url);
  const cover = article.cover as { url?: string } | Array<{ url?: string }> | undefined;
  if (Array.isArray(cover) && cover[0]?.url) return getMediaUrl(cover[0].url);
  if (cover && typeof cover === 'object' && 'url' in cover && typeof cover.url === 'string') return getMediaUrl(cover.url);
  return '';
}

export function LandingPage() {
  const { search, categoryId, sort, setSearch, setCategoryId, setSort } = useArticleStore();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredQuery = useArticlesQuery({ page: 1, pageSize: 7, search, categoryId, sort });
  const articles = featuredQuery.data?.data ?? [];
  const featured = articles[featuredIndex] ?? articles[0];
  const highlights = articles.slice(1, 4);
  const curated = articles.slice(4, 7);
  const featuredCover = featured ? pickCover(featured) : '';

  useEffect(() => {
    setSearch('');
    setCategoryId('');
    setSort('createdAt:desc');
  }, [setCategoryId, setSearch, setSort]);

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [articles.length]);

  const stats = useMemo(
    () => [
      { label: 'Artikel terkurasi', value: `${articles.length || 0}+` },
      { label: 'Kategori eksplorasi', value: '12' },
      { label: 'Kota & destinasi', value: '40+' },
    ],
    [articles.length],
  );

  return (
    <section className="page">
      <div className="container flex flex-col gap-8 sm:gap-10">
        <Card className="border-white/60 bg-white/86">
          <div
            className="flex min-h-[540px] items-end bg-[linear-gradient(135deg,#0d3b46_0%,#1f6f78_52%,#f4a261_100%)] bg-cover bg-center p-6 transition-all duration-700 ease-in-out sm:p-8 lg:p-10"
            style={featuredCover ? { backgroundImage: `linear-gradient(180deg, rgba(7, 24, 29, 0.24), rgba(7, 24, 29, 0.84)), url(${featuredCover})` } : undefined}
          >
            <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="max-w-4xl space-y-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Cerita perjalanan, panduan, dan penemuan
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight transition-all duration-500 sm:text-5xl lg:text-6xl lg:leading-[1.02]">
                    {featured?.title || 'Tampilan travel blog yang terasa premium, hangat, dan tetap mudah dipakai.'}
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-white/85 transition-all duration-500 sm:text-base">
                    {featured?.description || 'Dari inspirasi destinasi sampai cerita lokal yang detail, semua artikel disusun dalam pengalaman baca yang lebih modern, rapi, dan nyaman untuk dilihat di layar kecil maupun besar.'}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="rounded-2xl px-6">
                    <Link to="/home">Mulai eksplorasi</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white">
                    <Link to="/explore">Lihat kategori</Link>
                  </Button>
                </div>
                {articles.length > 0 ? (
                  <div className="flex gap-2 pt-2">
                    {articles.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFeaturedIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === featuredIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                        aria-label={`Ke slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/70">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((article) => (
            <Card key={article.documentId} className="group h-full border-white/70 bg-white/88 shadow-[0_24px_60px_rgba(31,42,46,0.06)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(31,42,46,0.12)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="h-full w-full bg-linear-to-br from-stone-200 to-orange-100 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]" style={pickCover(article) ? { backgroundImage: `url(${pickCover(article)})` } : undefined} />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent" />
              </div>
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                    {article.category?.name ?? 'Travel'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {article.location ?? 'Destinasi pilihan'}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-slate-900">{article.title}</h2>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {article.description ?? 'Cerita perjalanan yang membantu pembaca menangkap suasana destinasi sebelum benar-benar datang.'}
                  </p>
                </div>
                <Button asChild variant="secondary" className="mt-auto w-full rounded-2xl">
                  <Link to={`/article/${article.documentId}`}>Baca artikel</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-white/70 bg-white/88">
          <CardContent className="gap-7 p-7 sm:p-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-900">
                <Compass className="h-3.5 w-3.5" />
                Artikel Populer
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">Rekomendasi cepat untuk perjalanan berikutnya</h2>
                <Button asChild variant="ghost" className="h-auto rounded-full px-0 text-sm font-semibold text-teal-900 hover:bg-transparent hover:text-teal-700">
                  <Link to="/home" className="inline-flex items-center gap-2">
                    Lihat semua artikel
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {curated.map((article) => (
                <Card key={article.documentId} className="group h-full border-slate-200/80 bg-white/88 shadow-[0_20px_50px_rgba(31,42,46,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,42,46,0.1)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="h-full w-full bg-linear-to-br from-stone-200 to-orange-100 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]" style={pickCover(article) ? { backgroundImage: `url(${pickCover(article)})` } : undefined} />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/14 via-transparent to-transparent" />
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-3 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">{article.category?.name ?? 'Travel Guide'}</p>
                    <h3 className="line-clamp-2 flex-1 text-base font-bold text-slate-900">{article.title}</h3>
                    <Button asChild variant="secondary" className="w-full rounded-2xl">
                      <Link to={`/article/${article.documentId}`}>Lihat detail</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {featuredQuery.isLoading && !curated.length ? <p className="text-sm text-slate-500">Memuat artikel populer...</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
