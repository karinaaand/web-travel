import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../app/AppShell';

const LandingPage = lazy(() => import('../pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ArticlesPage = lazy(() => import('../pages/ArticlesPage').then((module) => ({ default: module.ArticlesPage })));
const ArticleDetailPage = lazy(() => import('../pages/ArticleDetailPage').then((module) => ({ default: module.ArticleDetailPage })));
const ExplorePage = lazy(() => import('../pages/ExplorePage').then((module) => ({ default: module.ExplorePage })));
const CreateArticlePage = lazy(() => import('../pages/CreateArticlePage').then((module) => ({ default: module.CreateArticlePage })));
const EditArticlePage = lazy(() => import('../pages/EditArticlePage').then((module) => ({ default: module.EditArticlePage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'home', element: <ArticlesPage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'article/:documentId', element: <ArticleDetailPage /> },
      { path: 'create', element: <CreateArticlePage /> },
      { path: 'edit/:documentId', element: <EditArticlePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
