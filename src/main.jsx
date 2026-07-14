import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import { AdminProvider } from './context/AdminContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AdminProvider>
  </StrictMode>,
)
