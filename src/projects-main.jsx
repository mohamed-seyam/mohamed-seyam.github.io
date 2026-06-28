import React from 'react'
import ReactDOM from 'react-dom/client'
import ProjectsPage from './ProjectsPage.jsx'
import { LanguageProvider } from './i18n.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ProjectsPage />
    </LanguageProvider>
  </React.StrictMode>,
)
