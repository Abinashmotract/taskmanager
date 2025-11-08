import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Note: StrictMode is disabled because react-beautiful-dnd has compatibility issues with it
createRoot(document.getElementById('root')).render(
  <App />
)
