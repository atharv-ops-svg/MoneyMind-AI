
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import '../styles/dialogue.css'

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

type DialogueResult = void | boolean | string | null

interface ActiveDialogue {
  id: number
  kind: 'alert' | 'confirm' | 'prompt'
  title: string
  message: string
  type: DialogueType
  confirmText: string
  cancelText: string
  inputLabel?: string
  placeholder?: string
  defaultValue?: string
  resolve: (result: DialogueResult) => void
}

interface DialogueContextValue {
  showAlert: (options: DialogueOptions) => Promise<void>
  showConfirm: (options: DialogueOptions) => Promise<boolean>
  showPrompt: (options: PromptOptions) => Promise<string | null>
}

const DialogueContext = createContext<DialogueContextValue | undefined>(
  undefined,
)

function getDialogueIcon(type: DialogueType) {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '!'
    case 'warning':
      return '⚠'
    default:
      return 'i'
  }
}

function DialogueView({
  dialogue,
  onResolve,
}: {
  dialogue: ActiveDialogue
  onResolve: (result: DialogueResult) => void
}) {
  const [inputValue, setInputValue] = useState(
    dialogue.defaultValue ?? '',
  )

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (dialogue.kind === 'prompt') {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [dialogue.id, dialogue.kind])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onResolve(
          dialogue.kind === 'alert'
            ? undefined
            : dialogue.kind === 'confirm'
              ? false
              : null,
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dialogue, onResolve])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (dialogue.kind === 'prompt') {
      onResolve(inputValue)
    } else if (dialogue.kind === 'confirm') {
      onResolve(true)
    } else {
      onResolve(undefined)
    }
  }

  function handleCancel() {
    onResolve(
      dialogue.kind === 'confirm'
        ? false
        : dialogue.kind === 'prompt'
          ? null
          : undefined,
    )
  }

  return (
    <div
      className="dialogue-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleCancel()
        }
      }}
    >
      <form
        className="dialogue-modal"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogue-title"
        aria-describedby="dialogue-message"
      >
        <div className={`dialogue-icon dialogue-icon-${dialogue.type}`}>
          {getDialogueIcon(dialogue.type)}
        </div>

        <h2 id="dialogue-title">{dialogue.title}</h2>

        <p id="dialogue-message">{dialogue.message}</p>

        {dialogue.kind === 'prompt' && (
          <div className="dialogue-input-group">
            {dialogue.inputLabel && (
              <label htmlFor="dialogue-input">
                {dialogue.inputLabel}
              </label>
            )}

            <input
              ref={inputRef}
              id="dialogue-input"
              type="text"
              value={inputValue}
              placeholder={dialogue.placeholder}
              onChange={(event) => setInputValue(event.target.value)}
            />
          </div>
        )}

        <div className="dialogue-actions">
          {dialogue.kind !== 'alert' && (
            <button
              type="button"
              className="dialogue-button dialogue-button-cancel"
              onClick={handleCancel}
            >
              {dialogue.cancelText}
            </button>
          )}

          <button
            type="submit"
            className={`dialogue-button dialogue-button-confirm dialogue-button-${dialogue.type}`}
          >
            {dialogue.confirmText}
          </button>
        </div>
      </form>
    </div>
  )
}

export function DialogueProvider({
  children,
}: {
  children: ReactNode
}) {
  const [dialogue, setDialogue] = useState<ActiveDialogue | null>(null)

  const activeDialogue = useRef<ActiveDialogue | null>(null)
  const nextId = useRef(0)

  const resolveDialogue = useCallback((result: DialogueResult) => {
    const active = activeDialogue.current

    if (!active) return

    activeDialogue.current = null
    setDialogue(null)
    active.resolve(result)
  }, [])

  const openDialogue = useCallback(
    (
      kind: ActiveDialogue['kind'],
      options: DialogueOptions | PromptOptions,
    ): Promise<DialogueResult> => {
      return new Promise((resolve) => {
        if (activeDialogue.current) {
          const previous = activeDialogue.current

          activeDialogue.current = null

          previous.resolve(
            previous.kind === 'alert'
              ? undefined
              : previous.kind === 'confirm'
                ? false
                : null,
          )
        }

        const nextDialogue: ActiveDialogue = {
          id: ++nextId.current,
          kind,
          title: options.title,
          message: options.message,
          type: options.type ?? 'info',
          confirmText: options.confirmText ?? 'Continue',
          cancelText: options.cancelText ?? 'Cancel',
          inputLabel:
            'inputLabel' in options ? options.inputLabel : undefined,
          placeholder:
            'placeholder' in options ? options.placeholder : undefined,
          defaultValue:
            'defaultValue' in options ? options.defaultValue : undefined,
          resolve,
        }

        activeDialogue.current = nextDialogue
        setDialogue(nextDialogue)
      })
    },
    [],
  )

  const showAlert = useCallback(
    async (options: DialogueOptions): Promise<void> => {
      await openDialogue('alert', {
        ...options,
        confirmText: options.confirmText ?? 'Got it',
      })
    },
    [openDialogue],
  )

  const showConfirm = useCallback(
    async (options: DialogueOptions): Promise<boolean> => {
      const result = await openDialogue('confirm', options)
      return result === true
    },
    [openDialogue],
  )

  const showPrompt = useCallback(
    async (options: PromptOptions): Promise<string | null> => {
      const result = await openDialogue('prompt', options)
      return typeof result === 'string' ? result : null
    },
    [openDialogue],
  )

  return (
    <DialogueContext.Provider
      value={{
        showAlert,
        showConfirm,
        showPrompt,
      }}
    >
      {children}

      {dialogue && (
        <DialogueView
          key={dialogue.id}
          dialogue={dialogue}
          onResolve={resolveDialogue}
        />
      )}
    </DialogueContext.Provider>
  )
}

export function useDialogue() {
  const context = useContext(DialogueContext)

  if (!context) {
    throw new Error(
      'useDialogue must be used inside a DialogueProvider.',
    )
  }

  return context
}
