import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, MapPin, PenSquare, Search, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/Card';
import { ErrorText } from '../components/ui/ErrorText';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ArticleFormModal } from '../components/ui/ArticleFormModal';
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal';
import { useArticlesQuery, useCategoriesQuery } from '../features/articles/store/articleQueries';
import { useArticleStore } from '../features/articles/store/articleStore';
import { useAuthStore } from '../features/auth/store/authStore';
import { getMediaUrl } from '../lib/strapi';

function pickCover(article: { cover_image_url?: string; cover?: unknown }) {
  if (article.cover_image_url) return getMediaUrl(article.cover_image_url);
  const cover = article.cover as { url?: string } | Array<{ url?: string }> | undefined;
  if (Array.isArray(cover) && cover[0]?.url) return getMediaUrl(cover[0].url);
  if (cover && typeof cover === 'object' && 'url' in cover && typeof cover.url === 'string') return getMediaUrl(cover.url);
  return '';
}

export function ArticlesPage() {
  const { page, pageSize, search, categoryId, sort, setSearch, setCategoryId } = useArticleStore();
  const { deleteArticle, saving } = useArticleStore();
  const { token } = useAuthStore();
  const [tempSearch, setTempSearch] = useState(search);
  const [tempCategoryId, setTempCategoryId] = useState(categoryId);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<{ documentId: string; title: string; description?: string; content?: string; location?: string; category?: { id: number } } | null>(null);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);
  const articlesQuery = useArticlesQuery({ page, pageSize, search, categoryId, sort });
  const categoriesQuery = useCategoriesQuery();

  const articles = articlesQuery.data?.data ?? [];
  const pagination = articlesQuery.data?.meta?.pagination;
  const total = pagination?.total ?? 0;
  const currentPage = pagination?.page ?? page;
  const pageCount = pagination?.pageCount ?? 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    setTempSearch(search);
    setTempCategoryId(categoryId);
  }, [search, categoryId]);

  const handleApplyFilter = () => {
    setSearch(tempSearch);
    setCategoryId(tempCategoryId);
    useArticleStore.setState({ page: 1 });
  };

  const handleEditClick = (article: typeof articles[0]) => {
    setEditingArticle({
      documentId: article.documentId,
      title: article.title,
      description: article.description,
      content: article.content,
      location: article.location,
      category: article.category ?? undefined,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (articleId: string) => {
    setDeletingArticleId(articleId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingArticleId) return;
    const ok = await deleteArticle(deletingArticleId);
    if (ok) setDeletingArticleId(null);
  };

  const handleModalSuccess = () => {
    setEditingArticle(null);
    articlesQuery.refetch?.();
  };

  return (
    <section className="page">
      <div className="container flex flex-col gap-7 sm:gap-8">
        <Card variant="soft" className="border-white/70 bg-white/88">
          <CardContent className="gap-8 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="space-y-4">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-900">
                  <Sparkles className="h-3.5 w-3.5" />
                  Halaman Beranda
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">Daftar artikel destinasi travel</CardTitle>
                  <CardDescription className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    Cari artikel berdasarkan judul, filter menurut kategori, lalu jelajahi hasilnya dengan layout yang lebih rapi, ringan, dan enak dipindai.
                  </CardDescription>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="relative sm:col-span-2 lg:col-span-1 xl:col-span-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input value={tempSearch} onChange={(event) => setTempSearch(event.target.value)} placeholder="Cari judul artikel" className="w-full pl-11" />
                </div>
                <Select value={tempCategoryId} onChange={(event) => setTempCategoryId(event.target.value)} className="h-12">
                  <option value="">Semua kategori</option>
                  {(categoriesQuery.data ?? []).map((category) => (
                    <option key={category.documentId} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <Button variant="secondary" type="button" onClick={handleApplyFilter} className="h-12 w-full">
                  Terapkan filter
                </Button>
                {token ? (
                  <Button type="button" onClick={() => setCreateModalOpen(true)} className="h-12 w-full sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <PenSquare className="h-4 w-4" />
                    Buat artikel
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <ErrorText message={articlesQuery.error instanceof Error ? articlesQuery.error.message : null} />

        {articlesQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse border-white/60 bg-white/72">
                <div className="aspect-4/3 bg-white/50" />
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="h-5 w-24 rounded-full bg-white/60" />
                  <div className="h-4 w-2/3 rounded bg-white/60" />
                  <div className="h-12 w-full rounded bg-white/60" />
                  <div className="mt-auto h-10 w-full rounded-2xl bg-white/60" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.documentId} className="group h-full border-white/70 bg-white/88 shadow-[0_24px_60px_rgba(31,42,46,0.06)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(31,42,46,0.12)]">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <div
                      className="h-full w-full bg-linear-to-br from-stone-200 to-orange-100 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                      style={pickCover(article) ? { backgroundImage: `url(${pickCover(article)})` } : undefined}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/18 via-transparent to-transparent" />
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                        {article.category?.name ?? 'Travel'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {article.location ?? 'Lokasi belum tersedia'}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-slate-900">{article.title}</h2>
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {article.description ?? 'Artikel travel ini membantu pengguna memahami karakter destinasi sebelum berkunjung.'}
                      </p>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <Button asChild variant="secondary" className="w-full rounded-2xl">
                        <Link to={`/article/${article.documentId}`}>Baca detail</Link>
                      </Button>
                      {token ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(article)} className="rounded-2xl text-teal-700 hover:bg-teal-50">
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteClick(article.documentId)} className="rounded-2xl text-rose-600 hover:bg-rose-50">
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!articles.length ? (
              <Card className="border-dashed border-slate-200 bg-white/72">
                <CardContent className="items-center justify-center gap-2 py-10 text-center">
                  <p className="text-base font-semibold text-slate-800">Belum ada artikel yang cocok.</p>
                  <p className="text-sm text-slate-500">Coba ubah kata kunci atau kategori agar hasilnya lebih luas.</p>
                </CardContent>
              </Card>
            ) : null}
          </>
        )}

        <Card className="border-white/70 bg-white/92">
          <CardContent className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
            <p className="text-sm font-medium text-slate-700">
              Menampilkan {total ? Math.max(1, (currentPage - 1) * pageSize + 1) : 0} sampai {Math.min(total, currentPage * pageSize)} dari {total} artikel
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" disabled={currentPage <= 1 || articlesQuery.isFetching} onClick={() => useArticleStore.setState({ page: currentPage - 1 })} className="rounded-2xl">
                Previous
              </Button>
              <div className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,72,86,0.16)]">
                {currentPage}/{pageCount}
              </div>
              <Button variant="secondary" disabled={currentPage >= pageCount || articlesQuery.isFetching} onClick={() => useArticleStore.setState({ page: currentPage + 1 })} className="rounded-2xl">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ArticleFormModal open={createModalOpen} onOpenChange={setCreateModalOpen} onSuccess={handleModalSuccess} />
      <ArticleFormModal open={editModalOpen} onOpenChange={setEditModalOpen} editingArticle={editingArticle} onSuccess={handleModalSuccess} />
      <DeleteConfirmModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} title="Hapus artikel ini?" description={`Artikel "${articles.find((a) => a.documentId === deletingArticleId)?.title}" akan dihapus secara permanen.`} onConfirm={handleDeleteConfirm} isLoading={saving} />
    </section>
  );
}
