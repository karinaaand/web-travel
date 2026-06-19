import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Compass, Layers3, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ArticlePreviewCard } from '../components/ui/ArticlePreviewCard';
import { ErrorText } from '../components/ui/ErrorText';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  useArticlesQuery,
  useCategoriesQuery,
  useCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../features/articles/store/articleQueries';
import { useArticleStore } from '../features/articles/store/articleStore';
import { useAuthStore } from '../features/auth/store/authStore';

type CategoryFormValues = {
  name: string;
};

export function ExplorePage() {
  const { search, categoryId, sort, setSearch, setCategoryId, setSort } = useArticleStore();
  const { token } = useAuthStore();
  const [tempSearch, setTempSearch] = useState(search);
  const [tempCategoryId, setTempCategoryId] = useState(categoryId);
  const [tempSort, setTempSort] = useState(sort);
  const articlesQuery = useArticlesQuery({ page: 1, pageSize: 12, search, categoryId, sort });
  const categoriesQuery = useCategoriesQuery();
  const selectedCategory = (categoriesQuery.data ?? []).find((category) => String(category.id) === tempCategoryId) ?? null;
  const categoryDetailQuery = useCategoryQuery(selectedCategory?.documentId);
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const articles = articlesQuery.data?.data ?? [];

  const categoryForm = useForm<CategoryFormValues>({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    setTempSearch(search);
    setTempCategoryId(categoryId);
    setTempSort(sort);
  }, [search, categoryId, sort]);

  const categoryDetail = categoryDetailQuery.data;

  const refreshCategoryPage = async () => {
    await Promise.all([
      categoriesQuery.refetch(),
      articlesQuery.refetch(),
      categoryDetailQuery.refetch(),
    ]);
  };

  const resetCategoryDraft = async () => {
    categoryForm.reset({ name: '' });
    setTempCategoryId('');
    setCategoryId('');
    await refreshCategoryPage();
  };

  const handleCreateCategory = async (values: CategoryFormValues) => {
    if (!values.name.trim()) return;
    const created = await createCategoryMutation.mutateAsync(values.name);
    if (created?.id) {
      const nextId = String(created.id);
      setTempCategoryId(nextId);
      setCategoryId(nextId);
      categoryForm.reset({ name: created.name });
      await refreshCategoryPage();
    } else {
      categoryForm.reset({ name: '' });
    }
  };

  const handleUpdateCategory = async () => {
    if (!categoryDetail?.documentId || !categoryForm.getValues('name').trim()) return;
    const updated = await updateCategoryMutation.mutateAsync({
      documentId: categoryDetail.documentId,
      name: categoryForm.getValues('name'),
    });

    if (updated?.id) {
      const nextId = String(updated.id);
      setTempCategoryId(nextId);
      setCategoryId(nextId);
      categoryForm.reset({ name: updated.name });
      await refreshCategoryPage();
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory?.documentId) return;
    await deleteCategoryMutation.mutateAsync(selectedCategory.documentId);
    await resetCategoryDraft();
  };

  const handleApplyFilter = () => {
    setSearch(tempSearch);
    setCategoryId(tempCategoryId);
    setSort(tempSort);
  };

  return (
    <section className="page">
      <div className="container flex flex-col gap-7 sm:gap-8">
        <Card variant="warm" className="border-white/70 bg-white/88">
          <CardContent className="gap-8 p-6 sm:p-8 lg:p-10">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-900">
                <Compass className="h-3.5 w-3.5" />
                Halaman Eksplorasi
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">Eksplorasi artikel berdasarkan kategori</CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Pilih kategori, ubah sorting, cari kata kunci, lalu telusuri artikel dengan tampilan yang lebih seimbang antara fungsi pencarian dan katalog konten.
                </CardDescription>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input value={tempSearch} onChange={(event) => setTempSearch(event.target.value)} placeholder="Cari topik, kota, atau destinasi" className="w-full pl-11" />
              </div>
              <Select value={tempCategoryId} onChange={(event) => setTempCategoryId(event.target.value)} className="h-12">
                <option value="">Semua kategori</option>
                {(categoriesQuery.data ?? []).map((category) => (
                  <option key={category.documentId} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <Select value={tempSort} onChange={(event) => setTempSort(event.target.value)} className="h-12">
                <option value="createdAt:desc">Terbaru</option>
                <option value="createdAt:asc">Terlama</option>
                <option value="title:asc">Judul A-Z</option>
                <option value="title:desc">Judul Z-A</option>
              </Select>
              <Button type="button" variant="secondary" onClick={handleApplyFilter} className="h-12 w-full lg:w-auto lg:px-6">
                Jelajahi
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88">
          <CardHeader className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                  <Layers3 className="h-3.5 w-3.5" />
                  Manajemen Kategori
                </div>
                <div>
                  <CardTitle className="text-2xl">Kelola kategori eksplorasi</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-7">
                    Panel kategori sekarang dibuat lebih bersih supaya aksi create, get, update, dan delete tidak terasa numpuk.
                  </CardDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => void resetCategoryDraft()}
                disabled={
                  createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending ||
                  deleteCategoryMutation.isPending ||
                  (!tempCategoryId && !categoryForm.watch('name').trim())
                }
              >
                <X className="h-4 w-4" />
                Batal aksi
              </Button>
            </div>
          </CardHeader>
          <CardContent className="gap-5">
            {!token ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Silakan <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">login</Link> untuk mengakses category management.
              </div>
            ) : (
              <>
                <form className="grid gap-4 lg:grid-cols-[1fr_auto]" onSubmit={categoryForm.handleSubmit(handleCreateCategory)}>
                  <Input label="Nama kategori baru" {...categoryForm.register('name')} placeholder="Contoh: Adventure" />
                  <Button type="submit" className="rounded-2xl lg:self-end" disabled={createCategoryMutation.isPending}>
                    {createCategoryMutation.isPending ? 'Membuat...' : 'Buat kategori'}
                  </Button>
                </form>

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <Select label="Pilih kategori untuk dikelola" value={tempCategoryId} onChange={(event) => setTempCategoryId(event.target.value)} className="h-12">
                    <option value="">Pilih kategori</option>
                    {(categoriesQuery.data ?? []).map((category) => (
                      <option key={category.documentId} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  <Button type="button" variant="secondary" className="rounded-2xl" onClick={() => tempCategoryId && setCategoryId(tempCategoryId)} disabled={!tempCategoryId}>
                    Gunakan kategori ini
                  </Button>
                </div>

                {selectedCategory ? (
                  <div className="grid gap-5 rounded-[28px] border border-slate-200/90 bg-slate-50/90 p-5 sm:p-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">Kategori yang dipilih</p>
                      <p className="text-xl font-semibold text-slate-900">{selectedCategory.name}</p>
                      <p className="break-all text-xs text-slate-500">documentId: {selectedCategory.documentId}</p>
                    </div>
                    <Input
                      label="Update nama kategori"
                      value={categoryForm.watch('name')}
                      onChange={(event) => categoryForm.setValue('name', event.target.value)}
                      placeholder={categoryDetail?.name ?? selectedCategory.name}
                    />
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <Button type="button" variant="secondary" className="rounded-2xl" onClick={() => categoryForm.reset({ name: categoryDetail?.name ?? selectedCategory.name })} disabled={categoryDetailQuery.isLoading}>
                        {categoryDetailQuery.isLoading ? 'Memuat detail...' : 'Ambil kategori'}
                      </Button>
                      <Button type="button" className="rounded-2xl" onClick={() => void handleUpdateCategory()} disabled={updateCategoryMutation.isPending}>
                        {updateCategoryMutation.isPending ? 'Memperbarui...' : 'Perbarui kategori'}
                      </Button>
                      <Button type="button" variant="destructive" className="rounded-2xl sm:col-span-2 xl:col-span-1" onClick={() => void handleDeleteCategory()} disabled={deleteCategoryMutation.isPending}>
                        {deleteCategoryMutation.isPending ? 'Menghapus...' : 'Hapus kategori'}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <ErrorText
          message={
            (articlesQuery.error instanceof Error && articlesQuery.error.message) ||
            (categoryDetailQuery.error instanceof Error && categoryDetailQuery.error.message) ||
            (createCategoryMutation.error instanceof Error && createCategoryMutation.error.message) ||
            (updateCategoryMutation.error instanceof Error && updateCategoryMutation.error.message) ||
            (deleteCategoryMutation.error instanceof Error && deleteCategoryMutation.error.message) ||
            null
          }
        />

        {articlesQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse border-white/60 bg-white/72">
                <div className="aspect-[4/3] bg-white/50" />
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="h-5 w-36 rounded-full bg-white/60" />
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
                <ArticlePreviewCard key={article.documentId} article={article} actionLabel="Baca detail" />
              ))}
            </div>

            {!articles.length ? (
              <Card className="border-dashed border-slate-200 bg-white/72">
                <CardContent className="items-center justify-center gap-2 py-10 text-center">
                  <p className="text-base font-semibold text-slate-800">Belum ada artikel untuk filter ini.</p>
                  <p className="text-sm text-slate-500">Coba ubah kategori, kata kunci, atau urutan sorting.</p>
                </CardContent>
              </Card>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
