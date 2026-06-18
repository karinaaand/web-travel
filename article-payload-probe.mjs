const BASE_URL = 'https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api';
const uniqueId = `probe-${Date.now()}`;
const credentials = {
  username: `user-${uniqueId}`,
  email: `${uniqueId}@example.com`,
  password: 'secret123',
};

async function request(method, path, { body, token, isFormData = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let requestBody;
  if (body !== undefined) {
    if (isFormData) {
      requestBody = body;
    } else {
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(body);
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: requestBody,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { response, data };
}

const register = await request('POST', '/auth/local/register', { body: credentials });
if (!register.response.ok) {
  console.log(JSON.stringify(register.data, null, 2));
  process.exit(1);
}
const token = register.data.jwt;

const categories = await request('GET', '/categories');
const categoryId = categories.data?.data?.[0]?.id;

const variants = [
  {
    name: 'title-description-location-category-cover',
    body: {
      data: {
        title: `Article ${uniqueId}`,
        description: 'Deskripsi uji artikel dari probe payload',
        location: 'Jakarta',
        category: categoryId,
      },
    },
  },
  {
    name: 'with-content',
    body: {
      data: {
        title: `Article ${uniqueId}`,
        description: 'Deskripsi uji artikel dari probe payload',
        content: 'Ini konten uji payload article yang cukup panjang untuk pengecekan.',
        location: 'Jakarta',
        category: categoryId,
      },
    },
  },
  {
    name: 'with-body',
    body: {
      data: {
        title: `Article ${uniqueId}`,
        description: 'Deskripsi uji artikel dari probe payload',
        body: 'Ini body uji payload article yang cukup panjang untuk pengecekan.',
        location: 'Jakarta',
        category: categoryId,
      },
    },
  },
  {
    name: 'with-summary',
    body: {
      data: {
        title: `Article ${uniqueId}`,
        summary: 'Ringkasan uji payload article',
        location: 'Jakarta',
        category: categoryId,
      },
    },
  },
  {
    name: 'raw-no-data-wrapper',
    body: {
      title: `Article ${uniqueId}`,
      description: 'Deskripsi uji article tanpa data wrapper',
      location: 'Jakarta',
      category: categoryId,
    },
  },
];

const results = [];
for (const variant of variants) {
  const result = await request('POST', '/articles', { token, body: variant.body });
  results.push({
    name: variant.name,
    status: result.response.status,
    data: result.data,
  });
}

console.log(JSON.stringify({ categoryId, results }, null, 2));
