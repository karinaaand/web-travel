import { test, expect, type Page } from '@playwright/test';

const API_BASE = 'https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api';
const STORAGE_KEY = 'travel-app-auth';
const AUTH_STATE = {
  token: 'valid-mocked-token',
  user: {
    id: 999,
    username: 'testuser',
    email: 'test@example.com',
  },
  rememberMe: true,
};

const article = {
  id: 1,
  documentId: 'article-1',
  title: 'Exploring Raja Ampat',
  description: 'A scenic journey across Indonesia\'s eastern paradise.',
  content:
    'Raja Ampat offers crystal-clear waters, dramatic karst formations, and unforgettable island-hopping experiences for curious travelers.\n\nThis mocked content is long enough to satisfy the article detail layout and comment flow checks.',
  location: 'Raja Ampat',
  category: {
    id: 10,
    documentId: 'category-10',
    name: 'Adventure',
  },
  author: {
    id: 999,
    username: 'testuser',
    email: 'test@example.com',
  },
  comments: [{ id: 501, documentId: 'comment-1' }],
  publishedAt: '2026-06-19T10:00:00.000Z',
  createdAt: '2026-06-18T10:00:00.000Z',
  updatedAt: '2026-06-19T10:00:00.000Z',
};

const articleByAnotherAuthor = {
  ...article,
  id: 2,
  documentId: 'article-2',
  title: 'Hidden Corners of Sumba',
  author: {
    id: 222,
    username: 'otheruser',
    email: 'other@example.com',
  },
};

const categories = [
  {
    id: 10,
    documentId: 'category-10',
    name: 'Adventure',
  },
  {
    id: 11,
    documentId: 'category-11',
    name: 'Culture',
  },
];

const comments = [
  {
    id: 501,
    documentId: 'comment-1',
    content: 'Pemandangannya luar biasa dan layak dikunjungi.',
    user: {
      id: 999,
      username: 'testuser',
    },
    createdAt: '2026-06-18T12:00:00.000Z',
    updatedAt: '2026-06-18T12:00:00.000Z',
  },
  {
    id: 502,
    documentId: 'comment-2',
    content: 'Daerah ini masuk wishlist perjalanan saya.',
    user: {
      id: 222,
      username: 'otheruser',
    },
    createdAt: '2026-06-17T12:00:00.000Z',
    updatedAt: '2026-06-17T12:00:00.000Z',
  },
];

async function clearAuth(page: Page) {
  await page.context().clearCookies();
  await page.addInitScript(() => {
    localStorage.clear();
  });
}

async function seedAuth(page: Page) {
  await page.context().clearCookies();
  await page.addInitScript(
    ([storageKey, authState]) => {
      localStorage.clear();
      localStorage.setItem(storageKey, JSON.stringify(authState));
    },
    [STORAGE_KEY, AUTH_STATE] as const,
  );
}

async function mockAppApi(page: Page) {
  await page.route(`${API_BASE}/users/me`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(AUTH_STATE.user),
    });
  });

  await page.route(`${API_BASE}/categories*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: categories, meta: {} }),
    });
  });

  await page.route(`${API_BASE}/articles*`, async (route) => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;

    if (pathname.endsWith('/articles/article-1')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: article, meta: {} }),
      });
      return;
    }

    if (pathname.endsWith('/articles/article-2')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: articleByAnotherAuthor, meta: {} }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [article, articleByAnotherAuthor],
        meta: {
          pagination: {
            page: 1,
            pageSize: 9,
            pageCount: 1,
            total: 2,
          },
        },
      }),
    });
  });

  await page.route(`${API_BASE}/comments/comment-1`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: comments[0], meta: {} }),
    });
  });

  await page.route(`${API_BASE}/comments*`, async (route) => {
    const method = route.request().method();

    if (method === 'POST') {
      const payload = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 503,
            documentId: 'comment-3',
            content: payload?.data?.content ?? 'Komentar baru',
            user: {
              id: 999,
              username: 'testuser',
            },
            createdAt: '2026-06-19T12:00:00.000Z',
            updatedAt: '2026-06-19T12:00:00.000Z',
          },
          meta: {},
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: comments, meta: {} }),
    });
  });
}

test.describe('Authorization', () => {
  test.describe('Guest user', () => {
    test.beforeEach(async ({ page }) => {
      await clearAuth(page);
      await mockAppApi(page);
    });

    test('redirects `/create` to `/login`', async ({ page }) => {
      await page.goto('/create');
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByText(/halaman login/i)).toBeVisible();
    });

    test('redirects `/edit/:documentId` to `/login`', async ({ page }) => {
      await page.goto('/edit/article-1');
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByText(/halaman login/i)).toBeVisible();
    });

    test('cannot see create, edit, or delete article actions on article list', async ({ page }) => {
      await page.goto('/home');
      await expect(page.getByRole('button', { name: /buat artikel/i })).toHaveCount(0);
      await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
      await expect(page.getByRole('button', { name: /^hapus$/i })).toHaveCount(0);
    });

    test('cannot see edit article or comment submission actions on article detail', async ({ page }) => {
      await page.goto('/article/article-1');
      await expect(page.getByRole('link', { name: /edit artikel/i })).toHaveCount(0);
      await expect(page.getByRole('button', { name: /tambah komentar|update komentar/i })).toHaveCount(0);
      await expect(page.getByText(/silakan login untuk menambahkan, mengedit, atau menghapus komentar/i)).toBeVisible();
    });

    test('can still see login and register entry points in navigation', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('navigation').getByRole('link', { name: /^login$/i })).toBeVisible();
      await expect(page.locator('a', { hasText: 'Register' }).first()).toBeVisible();
    });
  });

  test.describe('Authenticated user', () => {
    test.beforeEach(async ({ page }) => {
      await seedAuth(page);
      await mockAppApi(page);
    });

    test('can access `/create` and see article form shell', async ({ page }) => {
      await page.goto('/create');
      await expect(page).toHaveURL(/\/create$/);
      await expect(page.getByText(/tambahkan artikel travel baru/i)).toBeVisible();
      await expect(page.getByText(/checklist cepat/i)).toBeVisible();
    });

    test('can access `/edit/:documentId` and see populated edit page shell', async ({ page }) => {
      await page.goto('/edit/article-1');
      await expect(page).toHaveURL(/\/edit\/article-1$/);
      await expect(page.getByText(/perbarui artikel travel/i)).toBeVisible();
      await expect(page.getByText(/tip revisi/i)).toBeVisible();
    });

    test('can create articles but only sees manage actions for owned articles on article list', async ({ page }) => {
      await page.goto('/home');
      await expect(page.getByRole('button', { name: /buat artikel/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(1);
      await expect(page.getByRole('button', { name: /^hapus$/i })).toHaveCount(1);
      await expect(page.getByText(/hidden corners of sumba/i)).toBeVisible();
    });

    test.skip('shows article edit action only when the logged-in user owns the article', async ({ page }) => {
      await page.goto('/article/article-1');
      await expect(page.getByText('Exploring Raja Ampat')).toBeVisible();
      await expect(page.locator('a[href="/edit/article-1"]')).toHaveCount(1);

      await page.goto('/article/article-2');
      await expect(page.getByText('Hidden Corners of Sumba')).toBeVisible();
      await expect(page.locator('a[href="/edit/article-2"]')).toHaveCount(0);
    });

    test.skip('shows comment management only for the user own comments', async ({ page }) => {
      await page.goto('/article/article-1');
      await expect(page.getByText(/fitur komentar/i)).toBeVisible();
      await expect(page.getByText(/pemandangannya luar biasa/i)).toBeVisible();
      await expect(page.getByText(/wishlist perjalanan saya/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(1);
      await expect(page.getByRole('button', { name: /^hapus$/i })).toHaveCount(1);
      await expect(page.getByText(/silakan login untuk menambahkan, mengedit, atau menghapus komentar/i)).toHaveCount(0);
    });

    test('hides guest auth links and shows logged-in user menu', async ({ page }) => {
      await page.goto('/home');
      await expect(page.getByRole('navigation').getByRole('link', { name: /^login$/i })).toHaveCount(0);
      await expect(page.getByRole('navigation').getByRole('link', { name: /^register$/i })).toHaveCount(0);
      await expect(page.getByRole('button', { name: /^t$/i })).toBeVisible();
    });
  });
});
