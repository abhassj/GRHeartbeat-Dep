import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import MotionProvider from '@/components/providers/MotionProvider'
import { router } from '@/routes'
import '@/styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionProvider>
      <RouterProvider router={router} />
    </MotionProvider>
  </StrictMode>,
)
