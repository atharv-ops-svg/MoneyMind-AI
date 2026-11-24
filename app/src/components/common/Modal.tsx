import { X } from 'lucide-react'
import { useModal } from '../../context/useModal'

function Modal() {
  const { isOpen, content, closeModal } = useModal()

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={closeModal}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={closeModal}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {content}
      </div>
    </div>
  )
}

export default Modal