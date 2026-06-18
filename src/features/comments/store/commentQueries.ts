import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, fetchCommentByDocumentId, fetchCommentsByArticle, updateComment } from '../../../lib/queries';

export function useCommentsQuery(articleId: string) {
  return useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => fetchCommentsByArticle(articleId),
    enabled: Boolean(articleId),
  });
}

export function useCommentQuery(documentId: string | null) {
  return useQuery({
    queryKey: ['comment', documentId],
    queryFn: () => fetchCommentByDocumentId(documentId as string),
    enabled: Boolean(documentId),
  });
}

export function useCreateCommentMutation(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment({ articleId, content }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
  });
}

export function useUpdateCommentMutation(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => updateComment({ commentId, content }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      void queryClient.invalidateQueries({ queryKey: ['comment', variables.commentId] });
    },
  });
}

export function useDeleteCommentMutation(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      void queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      void queryClient.removeQueries({ queryKey: ['comment', commentId] });
    },
  });
}
