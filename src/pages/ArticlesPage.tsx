import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, PenSquare, Search, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/Card';
import { ErrorText } from '../components/ui/ErrorText';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ArticlePreviewCard } from '../components/ui/ArticlePreviewCard';
import { ArticleFormModal } from '../components/ui/ArticleFormModal';
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal';
import { useArticlesQuery, useCategoriesQuery } from '../features/articles/store/articleQueries';
import { useArticleStore } from '../features/articles/store/articleStore';
import { useAuthStore } from '../features/auth/store/authStore';

export function ArticlesPage() {
  const { page, pageSize, search, categoryId, sort, setSearch, setCategoryId } = useArticleStore();
  const { deleteArticle, saving } = useArticleStore();
  const { token, user } = useAuthStore();
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

  const canManageArticle = (article: typeof articles[number]) => Boolean(token && user && article.author?.id === user.id);

  const handleDeleteConfirm = async () => {
    if (!deletingArticleId) return false;

    const ok = await deleteArticle(deletingArticleId);
    if (ok) setDeletingArticleId(null);
    return ok;
  };

  const handleCreateModalChange = (open: boolean) => {
    setCreateModalOpen(open);
  };

  const handleEditModalChange = (open: boolean) => {
    setEditModalOpen(open);
    if (!open) setEditingArticle(null);
  };

  const handleDeleteModalChange = (open: boolean) => {
    setDeleteModalOpen(open);
    if (!open) setDeletingArticleId(null);
  };

  const handleModalSuccess = () => {
    setEditingArticle(null);
    articlesQuery.refetch?.();
  };

  return (
    <section className="page">
      <div className="container flex flex-col gap-7 sm:gap-8">
        <Card variant="soft" className="border-white/70 bg-white/88">
          <CardContent className="gap-8 p-5 sm:p-8 lg:p-10">
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
                  <div className="h-5 w-36 rounded-full bg-white/60" />
                  <div className="h-4 w-2/3 rounded bg-white/60" />
                  <div className="h-10 w-full rounded bg-white/60" />
                  <div className="mt-auto h-10 w-full rounded-2xl bg-white/60" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <div key={article.documentId} className="flex h-full flex-col gap-3 rounded-[28px] border border-white/60 bg-white/45 p-2 shadow-[0_18px_45px_rgba(31,42,46,0.06)]">
                  <ArticlePreviewCard article={article} actionLabel="Baca detail" />
                  {canManageArticle(article) ? (
                    <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(article)} className="rounded-2xl border-teal-200 text-teal-700 hover:bg-teal-50">
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteClick(article.documentId)} className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </Button>
                    </div>
                  ) : null}
                </div>
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
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7">
            <p className="text-sm font-medium text-slate-700">
              Menampilkan {total ? Math.max(1, (currentPage - 1) * pageSize + 1) : 0} sampai {Math.min(total, currentPage * pageSize)} dari {total} artikel
            </p>
            <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3">
              <Button variant="secondary" disabled={currentPage <= 1 || articlesQuery.isFetching} onClick={() => useArticleStore.setState({ page: currentPage - 1 })} className="rounded-2xl px-3 sm:px-4">
                Previous
              </Button>
              <div className="rounded-full bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,72,86,0.16)] sm:px-5">
                {currentPage}/{pageCount}
              </div>
              <Button variant="secondary" disabled={currentPage >= pageCount || articlesQuery.isFetching} onClick={() => useArticleStore.setState({ page: currentPage + 1 })} className="rounded-2xl px-3 sm:px-4">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ArticleFormModal open={createModalOpen} onOpenChange={handleCreateModalChange} onSuccess={handleModalSuccess} />
      <ArticleFormModal open={editModalOpen} onOpenChange={handleEditModalChange} editingArticle={editingArticle} onSuccess={handleModalSuccess} />
      <DeleteConfirmModal open={deleteModalOpen} onOpenChange={handleDeleteModalChange} title="Hapus artikel ini?" description={`Artikel "${articles.find((a) => a.documentId === deletingArticleId)?.title}" akan dihapus secara permanen.`} onConfirm={handleDeleteConfirm} isLoading={saving} />
    </section>
  );
}
