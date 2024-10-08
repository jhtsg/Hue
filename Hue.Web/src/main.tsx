import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './components/contexts/AuthContext.tsx'
import DimensionsProvider from './components/contexts/DimensionsContext.tsx'
import { RefreshProvider } from './components/contexts/RefreshContext.tsx'
import ThemeWrapper from './ThemeWrapper.tsx'
import { SnackbarProvider } from 'notistack'
import { PingPongProvider } from './components/contexts/PingPongContext.tsx'
import { RouterProvider } from 'react-router-dom'
import { HueRouter } from './HueRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PingPongProvider>
      <AuthProvider>
        <DimensionsProvider>
          <RefreshProvider>
            <ThemeWrapper>
              <SnackbarProvider maxSnack={4} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} >
                <RouterProvider router={HueRouter} />
              </SnackbarProvider>
            </ThemeWrapper>
          </RefreshProvider>
        </DimensionsProvider>
      </AuthProvider>
    </PingPongProvider>
  </StrictMode>,
)
