# Web Travel
A modern, responsive travel content platform built with React, TypeScript, Vite, Zustand, React Query, and Strapi API integration.

Explore Local Demo

Web Travel Banner

## Overview
Web Travel is a frontend assessment project designed to showcase a clean and practical article platform experience. Users can explore travel articles, filter content by category, authenticate into the application, and interact through comments and article management features.

The application was built with strong attention to:
- responsive design for mobile and desktop
- practical API integration with the provided Strapi backend
- structured frontend architecture
- clean UI composition and reliable user flow for submission/demo

## Key Features

### Public Interface
- Landing Page: A visually guided introduction at `/` that gives the app a more polished product feel.
- Article Discovery: Responsive article cards with search, category filter, sorting, and pagination.
- Article Detail: Readable article detail page with share action and comments section.
- Interactive Comments: Authenticated users can add, edit, and delete comments directly from the article page.

### Authentication and Content Flow
- Secure Auth Flow: Register, login, logout, and session restore using the provided Strapi auth endpoints.
- Article CRUD: Create, update, read, and delete article flow connected from the frontend.
- Category Management: Users can manage categories from the explore page and use them for filtering.
- Cover Upload: Upload-based cover handling for article forms.

### Technical Highlights
- Modern Frontend Stack: Built with React 19, TypeScript, and Vite.
- State Management: Zustand for client state and TanStack React Query for server-state fetching and caching.
- Styling System: Tailwind CSS based UI with reusable components and Radix-powered primitives.
- Stability Focus: Query configuration, loading states, error handling, and route completeness improved for a safer demo experience.

## Tech Stack and Versions

| Technology | Version | Purpose |
|---|---:|---|
| React | 19.x | UI Library |
| TypeScript | 6.x | Type Safety |
| Vite | 8.x | Frontend Build Tool |
| Zustand | 5.x | Client-side State Management |
| TanStack React Query | 5.x | API Fetching and Cache Management |
| Tailwind CSS | 4.x | Styling System |
| React Hook Form | 7.x | Form Handling |
| Zod | 4.x | Validation |
| Axios | 1.x | HTTP Client |
| Radix UI | Latest | Accessible UI Primitives |
| Lucide React | Latest | Icon System |
| Strapi API | Shared Dummy Instance | Headless Backend |

## Project Structure and Naming Conventions
The project follows a feature-oriented frontend structure.

### Directory Structure
```txt
src/
+-- app/                  # App shell and query client setup
+-- components/           # Shared UI components
¦   +-- ui/               # Reusable primitives (Button, Card, Input, Select, Modal)
+-- features/             # Domain-based logic
¦   +-- articles/         # Article hooks and Zustand store
¦   +-- auth/             # Authentication store and session logic
¦   +-- comments/         # Comment queries and components
+-- lib/                  # API client, config, schemas, helpers, shared types
+-- pages/                # Route-level pages
+-- router/               # Browser router configuration
+-- styles.css            # Global styles
```

### Naming Conventions
- Files: existing project naming is preserved for consistency with the repo structure
- Components: `PascalCase`
- Functions: `camelCase`
- Shared utilities: concise and descriptive naming
- Hooks and stores: feature-prefixed naming such as `useArticlesQuery`, `useAuthStore`, `useCreateCommentMutation`

## Routes
- `/` -> Landing page
- `/home` -> Article list page
- `/explore` -> Explore page and category management
- `/article/:documentId` -> Article detail page
- `/create` -> Create article page
- `/edit/:documentId` -> Edit article page
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

## Endpoint Usage Status
From the frontend codebase perspective, all 19 endpoints are referenced and integrated.

From runtime and user-flow perspective:
- Authentication flow is usable
- Article list and article detail are usable
- Category filtering and category management are usable
- Comments flow is usable
- Upload flow is usable
- Article mutation payloads were aligned to the backend shape currently accepted by the active API instance to reduce runtime demo risk

Important note:
- The provided shared API instance may still return restrictive `403` responses on some direct `documentId` endpoints depending on backend state
- This means endpoint coverage is complete in code, but some runtime behavior can still depend on the shared backend environment

## Article Query Parameters Used
The article listing flow consistently uses:
- `populate=*`
- `sort`
- `pagination[page]`
- `pagination[pageSize]`
- `filters[title][$containsi]`
- `filters[category][id][$eq]`

## Getting Started
Follow these steps to run the project locally.

### Prerequisites
- Node.js 20+
- npm

### Installation Steps
#### Clone the repository
```bash
git clone <your-repository-url>
cd TehnicalTest_Frontend_Engineer_Intern
```

#### Install dependencies
```bash
npm install
```

#### Run development server
```bash
npm run dev
```

#### Build production bundle
```bash
npm run build
```

#### Preview production build
```bash
npm run preview
```

Open the local Vite URL shown in the terminal to view the application.

## Available Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

## Validation, Loading, and Error Handling
- Zod is used for important form validation
- React Hook Form manages form state and submission flow
- Loading states exist across auth, article list, detail, forms, categories, and comments
- Skeleton loading is used in article grid views
- API error messages are surfaced in the UI when possible

## Design Direction
The interface does not rely on pre-made admin templates. Instead, it uses a custom design approach with:
- warm travel-oriented color treatment
- soft card surfaces and layered backgrounds
- responsive spacing and readable typography
- Tailwind-based reusable component styling

## Stability Notes
- Main article query params are centralized for consistency
- Key category selection flows were stabilized using native `Select`
- Route completeness has been improved so create/edit flows are directly reachable
- React Query defaults help reduce unnecessary refetch behavior

## Known Limitations
- Because the API is a shared dummy backend, runtime behavior can vary depending on concurrent usage by other candidates
- Some direct `GET by documentId` endpoints may return `403` from the backend instance
- Article mutation payloads were adjusted to match the currently accepted backend shape rather than an idealized content schema

## Why This Submission Stands Out
- Strong frontend fundamentals with TypeScript and state management
- Responsive UI with practical travel-app presentation
- Complete endpoint coverage in code
- Stable user-facing flows for demo and assessment
- Honest handling of backend limitations without hiding technical constraints

## Final Summary
Web Travel is a practical and polished frontend assessment submission built to balance clean architecture, attractive UI, and real-world API constraints. It aims to demonstrate not only implementation skill, but also the judgment needed to keep a product usable and presentable even when the backend is imperfect.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


