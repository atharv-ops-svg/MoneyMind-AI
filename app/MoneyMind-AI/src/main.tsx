
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

import { FinanceProvider } from './context/FinanceContext'
import { ModalProvider } from './context/ModalContext'
import { NotificationProvider } from './context/NotificationContext'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FinanceProvider>
        <ModalProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ModalProvider>
      </FinanceProvider>
    </BrowserRouter>
  </StrictMode>,
)
