import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Email atau username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean(),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const articleSchema = z.object({
  title: z.string().min(3, 'Judul artikel wajib diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  content: z.string().min(30, 'Konten minimal 30 karakter'),
  location: z.string().min(2, 'Lokasi wajib diisi'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  cover: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(3, 'Komentar minimal 3 karakter').max(500, 'Komentar maksimal 500 karakter'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ArticleValues = z.infer<typeof articleSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
