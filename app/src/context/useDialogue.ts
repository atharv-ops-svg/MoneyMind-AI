
import { createContext, useContext } from 'react'

export type DialogueType = 'success' | 'error' | 'warning' | 'info'

interface DialogueOptions {
  title: string
  message: string
  type?: DialogueType
  confirmText?: string
  cancelText?: string
}

interface PromptOptions extends DialogueOptions {
  inputLabel?: string
  placeholder?: string
  defaultValue?: string
}

interface DialogueContextValue {
  showAlert: (options: DialogueOptions) => Promise<void>
  showConfirm: (options: DialogueOptions) => Promise<boolean>
  showPrompt: (options: PromptOptions) => Promise<string | null>
}

export const DialogueContext = createContext<
  DialogueContextValue | undefined
>(undefined)

export function useDialogue() {
  const context = useContext(DialogueContext)

  if (!context) {
    throw new Error(
      'useDialogue must be used inside a DialogueProvider.',
    )
  }

  return context
}
