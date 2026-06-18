import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  fetchArticleByDocumentId,
  fetchArticles,
  fetchCategories,
  fetchCategoryByDocumentId,
  updateCategory,
} from '../../../lib/queries';

export function useArticlesQuery(params: { page: number; pageSize: number; search: string; categoryId: string; sort: string }) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => fetchArticles(params),
  });
}

export function useArticleQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['article', documentId],
    queryFn: () => fetchArticleByDocumentId(documentId as string),
    enabled: Boolean(documentId),
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });
}

export function useCategoryQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['category', documentId],
    queryFn: () => fetchCategoryByDocumentId(documentId as string),
    enabled: Boolean(documentId),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCategory({ name }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, name }: { documentId: string; name: string }) => updateCategory({ documentId, name }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
      void queryClient.invalidateQueries({ queryKey: ['category', variables.documentId] });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteCategory(documentId),
    onSuccess: (_, documentId) => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
      void queryClient.removeQueries({ queryKey: ['category', documentId] });
    },
  });
}
