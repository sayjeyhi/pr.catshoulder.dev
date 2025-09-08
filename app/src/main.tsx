import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'uno.css'
import App from './App.tsx'

import '@unocss/reset/tailwind-compat.css';
import 'react-toastify/dist/ReactToastify.css';
import '@xterm/xterm/css/xterm.css';
import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
