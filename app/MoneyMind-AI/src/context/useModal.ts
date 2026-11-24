import { useContext } from 'react'
import { ModalContext } from './ModalContextValue'

export function useModal() {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used inside a ModalProvider')
  }

  return context
}