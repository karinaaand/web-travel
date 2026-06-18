import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, PencilLine } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/Card';
import { ErrorText } from '../components/ui/ErrorText';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { useArticleQuery, useCategoriesQuery } from '../features/articles/store/articleQueries';
import { articleSchema, type ArticleValues } from '../lib/schemas';
import { useArticleStore } from '../features/articles/store/articleStore';
import type { ArticlePayload } from '../lib/types';

const defaultValues: ArticleValues = {
  title: '',
  description: '',
  content: '',
  location: '',
  category: '',
  cover: '',
};

export function EditArticlePage() {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const { saving, error, updateArticle, uploadCover } = useArticleStore();
  const articleQuery = useArticleQuery(documentId);
  const categoriesQuery = useCategoriesQuery();
  const [uploadName, setUploadName] = useState('');

  const form = useForm<ArticleValues>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!articleQuery.data) return;
    form.reset({
      title: articleQuery.data.title ?? '',
      description: articleQuery.data.description ?? '',
      content: articleQuery.data.content ?? '',
      location: articleQuery.data.location ?? '',
      category: articleQuery.data.category ? String(articleQuery.data.category.id) : '',
      cover: '',
    });
  }, [articleQuery.data, form]);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploadName(file.name);
    const fileId = await uploadCover(file);
    if (fileId) form.setValue('cover', String(fileId));
  };

  const onSubmit = async (values: ArticleValues) => {
    if (!documentId) return;
    const payload: ArticlePayload = {
      title: values.title,
      description: values.description,
      category: Number(values.category),
      ...(values.cover ? { cover: Number(values.cover) } : {}),
    };

    const ok = await updateArticle(documentId, payload);
    if (ok) navigate(`/article/${documentId}`);
  };

  return (
    <section className="page">
      <div className="container space-y-6 sm:space-y-7">
        <Card variant="soft" className="overflow-hidden border-white/70 bg-white/88">
          <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-900">
                <PencilLine className="h-3.5 w-3.5" />
                Edit Artikel
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl sm:text-[2.3rem]">Perbarui artikel travel</CardTitle>
                <CardDescription>
                  Perbarui artikel dengan alur yang tetap sederhana, rapi, dan nyaman dipakai.
                </CardDescription>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white/75 p-5">
              <p className="text-sm font-semibold text-slate-900">Tip revisi</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">Perbarui judul, deskripsi, kategori, atau cover agar tampilan artikel tetap relevan dan menarik.</p>
            </div>
          </CardContent>
        </Card>

        {articleQuery.isLoading && !articleQuery.data ? <Card><CardContent className="p-6 text-sm text-slate-500">Memuat data artikel...</CardContent></Card> : null}

        {articleQuery.data ? (
          <Card className="border-white/70 bg-white/88">
            <CardContent className="p-7 sm:p-8">
              <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                <Input label="Judul artikel" error={form.formState.errors.title?.message} {...form.register('title')} />
                <Input label="Deskripsi singkat" error={form.formState.errors.description?.message} {...form.register('description')} />

                <Select
                  label="Kategori"
                  error={form.formState.errors.category?.message}
                  value={form.watch('category')}
                  onChange={(event) => form.setValue('category', event.target.value, { shouldValidate: true })}
                >
                  <option value="">Pilih kategori</option>
                  {(categoriesQuery.data ?? []).map((category) => (
                    <option key={category.documentId} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>

                <div className="grid gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50/90 p-6 sm:p-7">
                  <Label htmlFor="cover-upload">Unggah ulang gambar</Label>
                  <Input id="cover-upload" type="file" accept="image/*" onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)} />
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <ImagePlus className="h-4 w-4" />
                    {uploadName ? `File baru: ${uploadName}` : 'Ganti cover bila ingin tampilan artikel lebih kuat di katalog.'}
                  </div>
                </div>

                <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Panduan revisi</p>
                  <p>Gunakan revisi singkat yang tepat agar artikel lebih mudah dipindai dan tetap konsisten dengan tampilan katalog.</p>
                </div>

                <ErrorText
                  message={
                    error ||
                    (articleQuery.error instanceof Error ? articleQuery.error.message : null) ||
                    (categoriesQuery.error instanceof Error ? categoriesQuery.error.message : null)
                  }
                />

                <div className="flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button variant="outline" type="button" onClick={() => navigate(`/article/${documentId}`)} className="rounded-2xl">Batal</Button>
                  <Button type="submit" disabled={saving} className="rounded-2xl">{saving ? 'Menyimpan perubahan...' : 'Update artikel'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}

