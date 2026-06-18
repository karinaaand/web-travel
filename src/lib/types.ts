export type AuthUser = {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  jwt: string;
  user: AuthUser;
};

export type StrapiListResponse<T> = {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug?: string;
};

export type UploadFile = {
  id: number;
  url: string;
  name: string;
  mime?: string;
  alternativeText?: string | null;
};

export type Article = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  content?: string;
  location?: string;
  slug?: string;
  cover_image_url?: string;
  cover?: UploadFile | UploadFile[] | null;
  category?: Category | null;
  author?: AuthUser | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type Comment = {
  id: number;
  documentId: string;
  content: string;
  article?: { id: number; documentId?: string };
  user?: { id: number; username: string };
  createdAt?: string;
  updatedAt?: string;
};

export type ArticlePayload = {
  title: string;
  description: string;
  category?: number | '';
  cover?: number | '';
};
