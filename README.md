# Web Travel
A modern, responsive travel content platform built with React, TypeScript, Vite, Zustand, React Query, and Strapi API integration.

[Explore Local Demo](https://web-travel-beryl.vercel.app/)

## Overview
Web Travel is a frontend assessment project designed to showcase a clean and practical article platform experience. Users can explore travel articles, filter content by category, authenticate into the application, and interact through comments and article management features.

The application was built with strong attention to:
- responsive design for mobile and desktop
- practical API integration with the provided Strapi backend
- structured frontend architecture
- clean UI composition and reliable user flow for submission and demo

## Key Features

### Public Interface
- Landing Page: A visually guided introduction at `/`.
- Article Discovery: Responsive article cards with search, category filter, sorting, and pagination.
- Article Detail: Readable article detail page with share action and comments section.
- Explore Page: Category-aware exploration page with filtering and management tools.

### Authentication and Content Flow
- Secure Auth Flow: Register, login, logout, and session restore using the provided Strapi auth endpoints.
- Protected Routes: `/create` and `/edit/:documentId` are guarded for authenticated users only.
- Article CRUD: Create, update, read, and delete article flow connected from the frontend.
- Ownership-aware Actions: Edit and delete actions are only shown for content owned by the logged-in user.
- Cover Upload: Upload-based cover handling for article forms.

### Technical Highlights
- Modern Frontend Stack: Built with React 19, TypeScript, and Vite.
- State Management: Zustand for client state and TanStack React Query for server-state fetching and caching.
- Styling System: Tailwind CSS based UI with reusable components and Radix-powered primitives.
- Stability Focus: Query configuration, loading states, error handling, and route completeness improved for a safer demo experience.
- Authorization Tests: Playwright coverage exists for guest and authenticated authorization scenarios.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Library |
| TypeScript | Type Safety |
| Vite | Frontend Build Tool |
| Zustand | Client-side State Management |
| TanStack React Query | API Fetching and Cache Management |
| Tailwind CSS | Styling System |
| React Hook Form | Form Handling |
| Zod | Validation |
| Axios | HTTP Client |
| Radix UI | Accessible UI Primitives |
| Lucide React | Icon System |
| Playwright | End-to-end authorization testing |
| Strapi API | Headless Backend |

## Project Structure
```txt
src/
+-- app/                  # App shell and query client setup
+-- components/           # Shared UI components
|   +-- ui/               # Reusable primitives
+-- features/             # Domain-based logic
|   +-- articles/         # Article hooks and Zustand store
|   +-- auth/             # Authentication store and session logic
|   +-- comments/         # Comment queries and components
+-- lib/                  # API client, config, schemas, helpers, shared types
+-- pages/                # Route-level pages
+-- router/               # Browser router configuration
+-- styles.css            # Global styles

tests/
+-- authorization.spec.ts # Playwright authorization coverage
```

## Routes
- `/` -> Landing page
- `/home` -> Article list page
- `/explore` -> Explore page and category management
- `/article/:documentId` -> Article detail page
- `/create` -> Create article page, protected
- `/edit/:documentId` -> Edit article page, protected
- `/login` -> Login page
- `/register` -> Register page

## API Base URL
```txt
https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api
```

## Endpoint Coverage

### Authentication
- `POST /auth/local/register`
- `POST /auth/local`
- `GET /users/me`

### Articles
- `GET /articles?populate=*`
- `GET /articles/{documentId}`
- `POST /articles`
- `PUT /articles/{documentId}`
- `DELETE /articles/{documentId}`

### Categories
- `GET /categories`
- `GET /categories/{documentId}`
- `POST /categories`
- `PUT /categories/{documentId}`
- `DELETE /categories/{documentId}`

### Comments
- `GET /comments`
- `GET /comments/{documentId}`
- `POST /comments`
- `PUT /comments/{documentId}`
- `DELETE /comments/{documentId}`

### Upload
- `POST /upload`

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Authorization Tests
```bash
npm test
npm run test:auth
```

Open the local Vite URL shown in the terminal to view the application.

## Available Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "playwright test",
  "test:auth": "playwright test authorization"
}
```

## Validation, Loading, and Error Handling
- Zod is used for important form validation.
- React Hook Form manages form state and submission flow.
- Loading states exist across auth, article list, detail, forms, categories, and comments.
- Skeleton loading is used in article grid views.
- API error messages are surfaced in the UI when possible.

## Known Limitations
- Because the API is a shared dummy backend, runtime behavior can vary depending on concurrent usage by other candidates.
- Some direct `GET by documentId` endpoints may return `403` from the backend instance.
- Article mutation payloads were adjusted to match the currently accepted backend shape rather than an idealized content schema.
- Full Playwright cross-browser execution depends on the required browser binaries being installed locally.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
