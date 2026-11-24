import { createContext } from 'react'
import type { ReactNode } from 'react'

export interface ModalContextType {
  isOpen: boolean
  content: ReactNode | null
  openModal: (content: ReactNode) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
)