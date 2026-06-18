import { api } from './api';
import type { Article, Category, Comment, StrapiListResponse, StrapiSingleResponse } from './types';

export type ArticleQueryInput = {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  sort?: string;
};

export function buildArticleParams({
  page = 1,
  pageSize = 9,
  search = '',
  categoryId = '',
  sort = 'createdAt:desc',
}: ArticleQueryInput) {
  return {
    populate: '*',
    sort,
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
    ...(search ? { 'filters[title][$containsi]': search } : {}),
    ...(categoryId ? { 'filters[category][id][$eq]': categoryId } : {}),
  };
}

export async function fetchArticles(input: ArticleQueryInput = {}) {
  const { data } = await api.get<StrapiListResponse<Article>>('/articles', {
    params: buildArticleParams(input),
  });
  return data;
}

export async function fetchArticleByDocumentId(documentId: string) {
  try {
    const { data } = await api.get<StrapiSingleResponse<Article>>(`/articles/${documentId}`, {
      params: {
        populate: '*',
      },
    });

    if (!data?.data) {
      throw new Error('Article not found');
    }

    return data.data;
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;

    if (status === 403 || status === 404) {
      const { data } = await api.get<StrapiListResponse<Article>>('/articles', {
        params: {
          populate: '*',
          'filters[documentId][$eq]': documentId,
        },
      });

      if (data.data?.length) {
        return data.data[0];
      }
    }

    throw error;
  }
}

export async function fetchCategories() {
  const { data } = await api.get<StrapiListResponse<Category>>('/categories');
  return data.data;
}

export async function fetchCategoryByDocumentId(documentId: string) {
  const { data } = await api.get<StrapiSingleResponse<Category>>(`/categories/${documentId}`);
  return data.data;
}

export async function createCategory(payload: { name: string }) {
  const { data } = await api.post<StrapiSingleResponse<Category>>('/categories', {
    data: payload,
  });
  return data.data;
}

export async function updateCategory(payload: { documentId: string; name: string }) {
  const { data } = await api.put<StrapiSingleResponse<Category>>(`/categories/${payload.documentId}`, {
    data: { name: payload.name },
  });
  return data.data;
}

export async function deleteCategory(documentId: string) {
  await api.delete(`/categories/${documentId}`);
}

export async function fetchCommentsByArticle(articleId: string) {
  const { data } = await api.get<StrapiListResponse<Comment>>('/comments', {
    params: {
      'filters[article][documentId][$eq]': articleId,
      sort: 'createdAt:desc',
    },
  });
  return data.data ?? [];
}

export async function fetchCommentByDocumentId(documentId: string) {
  const { data } = await api.get<StrapiSingleResponse<Comment>>(`/comments/${documentId}`);
  return data.data;
}

export async function createComment(payload: { articleId: string; content: string }) {
  const { data } = await api.post<StrapiSingleResponse<Comment>>('/comments', {
    data: {
      content: payload.content,
      article: payload.articleId,
    },
  });

  return data.data;
}

export async function updateComment(payload: { commentId: string; content: string }) {
  const { data } = await api.put<StrapiSingleResponse<Comment>>(`/comments/${payload.commentId}`, {
    data: { content: payload.content },
  });

  return data.data;
}

export async function deleteComment(commentId: string) {
  await api.delete(`/comments/${commentId}`);
}
