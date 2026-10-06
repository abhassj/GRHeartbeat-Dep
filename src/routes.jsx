import { createBrowserRouter } from 'react-router'
import RootLayout from '@/components/layout/RootLayout'
import NotFound from '@/pages/NotFound'

// Pages are code-split: each route's module loads only when it is first visited.
const page = (load) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: NotFound,
    children: [
      { index: true, lazy: page(() => import('@/pages/Home')) },
      { path: 'courses/:region', lazy: page(() => import('@/pages/CoursesRegion')) },
      { path: 'courses/:region/:slug', lazy: page(() => import('@/pages/CourseDetail')) },
      { path: 'about', lazy: page(() => import('@/pages/About')) },
      // The contact page is itself the contact options, so it skips the final CTA band.
      {
        path: 'contact',
        handle: { finalCta: false },
        lazy: page(() => import('@/pages/Contact')),
      },
      { path: 'privacy', lazy: page(() => import('@/pages/Privacy')) },
      // Internal component catalogue: unlinked and noindex. Remove before launch (Phase 8).
      { path: 'styleguide', lazy: page(() => import('@/pages/Styleguide')) },
      { path: '*', Component: NotFound },
    ],
  },
])
