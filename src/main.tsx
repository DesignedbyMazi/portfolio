import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CaseStudyPage from './pages/CaseStudyPage.tsx'

const caseStudySlug = (() => {
  const m = window.location.pathname.match(/^\/case-study\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {caseStudySlug
      ? <CaseStudyPage slug={caseStudySlug} onGoHome={() => { window.location.href = '/'; }} />
      : <App />
    }
  </StrictMode>,
)
