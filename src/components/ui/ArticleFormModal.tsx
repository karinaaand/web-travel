import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader } from 'lucide-react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './Dialog';
import { ErrorText } from './ErrorText';
import { Input } from './Input';
import { Label } from './Label';
import { Select } from './Select';
import { useCategoriesQuery } from '../../features/articles/store/articleQueries';
import { articleSchema, type ArticleValues } from '../../lib/schemas';
import { useArticleStore } from '../../features/articles/store/articleStore';
import type { ArticlePayload } from '../../lib/types';

interface ArticleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingArticle?: {
    documentId: string;
    title: string;
    description?: string;
    content?: string;
    location?: string;
    category?: { id: number } | null;
  } | null;
  onSuccess?: () => void;
}

const defaultValues: ArticleValues = {
  title: '',
  description: '',
  content: '',
  location: '',
  category: '',
  cover: '',
};

export function ArticleFormModal({ open, onOpenChange, editingArticle, onSuccess }: ArticleFormModalProps) {
  const { saving, error, createArticle, updateArticle, uploadCover } = useArticleStore();
  const categoriesQuery = useCategoriesQuery();
  const [uploadName, setUploadName] = useState('');

  const form = useForm<ArticleValues>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingArticle) {
      form.reset({
        title: editingArticle.title ?? '',
        description: editingArticle.description ?? '',
        content: editingArticle.content ?? '',
        location: editingArticle.location ?? '',
        category: editingArticle.category ? String(editingArticle.category.id) : '',
        cover: '',
      });
      setUploadName('');
    } else {
      form.reset(defaultValues);
      setUploadName('');
    }
  }, [editingArticle, open, form]);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploadName(file.name);
    const fileId = await uploadCover(file);
    if (fileId) form.setValue('cover', String(fileId));
  };

  const onSubmit = async (values: ArticleValues) => {
    const payload: ArticlePayload = {
      title: values.title,
      description: values.description,
      category: Number(values.category),
      ...(values.cover ? { cover: Number(values.cover) } : {}),
    };

    let ok = false;
    if (editingArticle) {
      ok = await updateArticle(editingArticle.documentId, payload);
    } else {
      ok = await createArticle(payload);
    }

    if (ok) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const isLoading = editingArticle && !editingArticle.title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingArticle ? 'Perbarui artikel' : 'Buat artikel baru'}</DialogTitle>
          <DialogDescription>
            {editingArticle
              ? 'Perbarui informasi artikel travel Anda dengan layout yang lebih rapi dan nyaman.'
              : 'Tambahkan artikel travel baru dengan form yang lega dan mudah di-scan.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-5 w-5 animate-spin text-teal-600" />
          </div>
        ) : (
          <form className="grid gap-6 py-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Input label="Judul artikel" error={form.formState.errors.title?.message} {...form.register('title')} placeholder="Contoh: Menyusuri pagi di Ubud" />

            <Input label="Deskripsi singkat" error={form.formState.errors.description?.message} {...form.register('description')} placeholder="Ringkasan singkat untuk card dan preview" />

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

            <div className="grid gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50/90 p-6">
              <Label htmlFor="cover-upload">Unggah gambar</Label>
              <Input id="cover-upload" type="file" accept="image/*" onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)} />
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ImagePlus className="h-4 w-4" />
                {uploadName ? `File terpilih: ${uploadName}` : 'Pilih cover agar artikel terlihat lebih menarik.'}
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Panduan singkat</p>
              <p>Lengkapi judul, deskripsi, kategori, dan cover agar artikel tampil rapi dan siap dipublikasikan.</p>
            </div>

            <ErrorText message={error || (categoriesQuery.error instanceof Error ? categoriesQuery.error.message : null)} />

            <DialogFooter className="gap-3 pt-4 sm:gap-3">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="rounded-2xl" disabled={saving}>
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="rounded-2xl">
                {saving ? `${editingArticle ? 'Menyimpan perubahan' : 'Menyimpan artikel'}...` : editingArticle ? 'Update artikel' : 'Publikasikan artikel'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

