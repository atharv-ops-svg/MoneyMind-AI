import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import { ModalContext } from './ModalContextValue'

interface ModalProviderProps {
  children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [content, setContent] = useState<ReactNode | null>(null)

  const isOpen = content !== null

  const openModal = useCallback((modalContent: ReactNode) => {
    setContent(modalContent)
  }, [])

  const closeModal = useCallback(() => {
    setContent(null)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeModal])

  return (
    <ModalContext.Provider
      value={{ isOpen, content, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  )
}