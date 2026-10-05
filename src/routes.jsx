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
      { path: 'contact', lazy: page(() => import('@/pages/Contact')) },
      { path: '*', Component: NotFound },
    ],
  },
])
