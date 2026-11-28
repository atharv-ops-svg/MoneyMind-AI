
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import { FinanceProvider } from './context/FinanceContext'
import { ModalProvider } from './context/ModalContext'
import { NotificationProvider } from './context/NotificationContext'
import { DialogueProvider } from './context/DialogueContext'

ReactDOM.createRoot(
  document.getElementById('root')!,
).render(
  <React.StrictMode>
    <FinanceProvider>
      <ModalProvider>
        <NotificationProvider>
          <DialogueProvider>
            <App />
          </DialogueProvider>
        </NotificationProvider>
      </ModalProvider>
    </FinanceProvider>
  </React.StrictMode>,
)
