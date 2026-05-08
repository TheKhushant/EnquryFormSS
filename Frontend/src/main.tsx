import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EnquiryProvider } from '../contexts/EnquiryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnquiryProvider>
      <App />
    </EnquiryProvider>
  </StrictMode>,
)
