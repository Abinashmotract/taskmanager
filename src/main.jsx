import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// @hello-pangea/dnd is compatible with StrictMode and React 19
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
