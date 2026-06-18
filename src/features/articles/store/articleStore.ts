import { create } from 'zustand';
import { api } from '../../../lib/api';
import { buildArticleParams } from '../../../lib/queries';
import type { Article, ArticlePayload, Category, StrapiListResponse } from '../../../lib/types';

type ArticleState = {
  articles: Article[];
  selectedArticle: Article | null;
  categories: Category[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  search: string;
  categoryId: string;
  sort: string;
  fetchArticles: (options?: { page?: number; search?: string; categoryId?: string; pageSize?: number; sort?: string }) => Promise<void>;
  fetchArticle: (documentId: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createArticle: (payload: ArticlePayload) => Promise<boolean>;
  updateArticle: (documentId: string, payload: ArticlePayload) => Promise<boolean>;
  deleteArticle: (documentId: string) => Promise<boolean>;
  uploadCover: (file: File) => Promise<number | null>;
  clearSelected: () => void;
  setSearch: (value: string) => void;
  setCategoryId: (categoryId: string) => void;
  setPageSize: (pageSize: number) => void;
  setSort: (sort: string) => void;
};

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  selectedArticle: null,
  categories: [],
  loading: false,
  saving: false,
  error: null,
  page: 1,
  pageSize: 9,
  pageCount: 1,
  total: 0,
  search: '',
  categoryId: '',
  sort: 'createdAt:desc',
  async fetchArticles(options) {
    const page = options?.page ?? get().page;
    const search = options?.search ?? get().search;
    const categoryId = options?.categoryId ?? get().categoryId;
    const pageSize = options?.pageSize ?? get().pageSize;
    const sort = options?.sort ?? get().sort;

    set({ loading: true, error: null, page, search, categoryId, pageSize, sort });
    try {
      const { data } = await api.get<StrapiListResponse<Article>>('/articles', {
        params: buildArticleParams({ page, pageSize, search, categoryId, sort }),
      });
      set({
        articles: data.data,
        page: data.meta?.pagination?.page ?? page,
        pageSize: data.meta?.pagination?.pageSize ?? pageSize,
        pageCount: data.meta?.pagination?.pageCount ?? 1,
        total: data.meta?.pagination?.total ?? data.data.length,
        loading: false,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch articles', loading: false });
    }
  },
  async fetchArticle(documentId) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<StrapiListResponse<Article>>('/articles', {
        params: {
          populate: '*',
          'filters[documentId][$eq]': documentId,
        },
      });
      if (data.data && data.data.length > 0) {
        set({ selectedArticle: data.data[0], loading: false });
      } else {
        set({ error: 'Article not found', loading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch article', loading: false });
    }
  },
  async fetchCategories() {
    try {
      const { data } = await api.get<StrapiListResponse<Category>>('/categories');
      set({ categories: data.data });
    } catch {
    }
  },
  async createArticle(payload) {
    set({ saving: true, error: null });
    try {
      await api.post('/articles', { data: payload });
      set({ saving: false });
      await get().fetchArticles({ page: 1 });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create article', saving: false });
      return false;
    }
  },
  async updateArticle(documentId, payload) {
    set({ saving: true, error: null });
    try {
      await api.put(`/articles/${documentId}`, { data: payload });
      set({ saving: false });
      await get().fetchArticles();
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update article', saving: false });
      return false;
    }
  },
  async deleteArticle(documentId) {
    set({ saving: true, error: null });
    try {
      await api.delete(`/articles/${documentId}`);
      set({ saving: false });
      await get().fetchArticles();
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete article', saving: false });
      return false;
    }
  },
  async uploadCover(file) {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return Array.isArray(data) && data[0]?.id ? data[0].id : null;
    } catch {
      return null;
    }
  },
  clearSelected() {
    set({ selectedArticle: null });
  },
  setSearch(value) {
    set({ search: value });
  },
  setCategoryId(categoryId) {
    set({ categoryId });
  },
  setPageSize(pageSize) {
    set({ pageSize });
  },
  setSort(sort) {
    set({ sort });
  },
}));
