import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'uno.css'
import App from './App.tsx'

import '@unocss/reset/tailwind-compat.css';
import 'react-toastify/dist/ReactToastify.css';
import './bolt/app/styles/index.scss';
import '@xterm/xterm/css/xterm.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
