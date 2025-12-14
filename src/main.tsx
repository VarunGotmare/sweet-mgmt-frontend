import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/authContext.tsx'
import { Toaster } from 'react-hot-toast'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b", // zinc-900
              color: "#fff",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
