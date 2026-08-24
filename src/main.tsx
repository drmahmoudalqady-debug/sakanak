import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// HashRouter: يضمن عمل كل الروابط على الاستضافة الثابتة (Netlify) بدون إعدادات إضافية
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
