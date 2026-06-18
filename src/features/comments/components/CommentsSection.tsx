import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { ErrorText } from '../../../components/ui/ErrorText';
import { Label } from '../../../components/ui/Label';
import { commentSchema, type CommentValues } from '../../../lib/schemas';
import { useAuthStore } from '../../auth/store/authStore';
import { useCommentQuery, useCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from '../store/commentQueries';

export function CommentsSection({ articleId }: { articleId: string }) {
  const { user } = useAuthStore();
  const commentsQuery = useCommentsQuery(articleId);
  const createMutation = useCreateCommentMutation(articleId);
  const updateMutation = useUpdateCommentMutation(articleId);
  const deleteMutation = useDeleteCommentMutation(articleId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const commentDetailQuery = useCommentQuery(editingId);

  const form = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const comments = commentsQuery.data ?? [];
  const mutationError =
    (createMutation.error instanceof Error && createMutation.error.message) ||
    (updateMutation.error instanceof Error && updateMutation.error.message) ||
    (deleteMutation.error instanceof Error && deleteMutation.error.message) ||
    null;

  const handleAddComment = async (values: CommentValues) => {
    if (!user) return;

    if (editingId) {
      await updateMutation.mutateAsync({ commentId: editingId, content: values.content });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync(values.content);
    }

    form.reset({ content: '' });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-900">
          Fitur Komentar
        </span>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{comments.length} komentar</h3>
      </div>

      <ErrorText
        message={
          mutationError ||
          (commentsQuery.error instanceof Error ? commentsQuery.error.message : null) ||
          (commentDetailQuery.error instanceof Error ? commentDetailQuery.error.message : null)
        }
      />

      {user ? (
        <Card variant="soft">
          <CardHeader>
            <CardTitle className="text-lg">Tulis komentar</CardTitle>
            <CardDescription>Bagikan insight atau pengalaman Anda tentang destinasi ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleAddComment)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="comment-content">Komentar</Label>
                <textarea
                  id="comment-content"
                  className="min-h-35 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-teal-600"
                  {...form.register('content')}
                  placeholder="Bagikan insight atau pengalaman Anda tentang destinasi ini..."
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                {form.formState.errors.content?.message ? <span className="text-sm text-rose-600">{form.formState.errors.content.message}</span> : null}
              </div>
              {editingId ? (
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-500">
                  {commentDetailQuery.isLoading ? 'Memuat detail komentar...' : `Editing comment ID: ${commentDetailQuery.data?.documentId ?? editingId}`}
                </div>
              ) : null}
              <div className="flex-wrap gap-3">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl">
                  {editingId ? 'Update komentar' : 'Tambah komentar'}
                </Button>
                {editingId ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      setEditingId(null);
                      form.reset({ content: '' });
                    }}
                  >
                    Batal edit
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-5 text-sm text-slate-600">
            Silakan login untuk menambahkan, mengedit, atau menghapus komentar.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {commentsQuery.isLoading ? <div className="text-sm text-slate-500">Memuat komentar...</div> : null}
        {!commentsQuery.isLoading && comments.length === 0 ? <div className="text-sm text-slate-500">Belum ada komentar. Jadilah yang pertama berbagi pendapat.</div> : null}

        {comments.map((comment) => (
          <Card key={comment.documentId} className="border-white/60 bg-white/80">
            <CardContent className="space-y-4 p-5">
              <div className="flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{comment.user?.username ?? 'Anonim'}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tanggal tidak diketahui'}
                  </p>
                </div>
                {user && user.id === comment.user?.id ? (
                  <div className="flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      type="button"
                      className="rounded-xl"
                      onClick={() => {
                        setEditingId(comment.documentId);
                        form.reset({ content: comment.content });
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" type="button" className="rounded-xl" onClick={() => void deleteMutation.mutateAsync(comment.documentId)} disabled={deleteMutation.isPending}>
                      Hapus
                    </Button>
                  </div>
                ) : null}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
