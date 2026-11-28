
import { useEffect, useState } from 'react'

type VerificationStatus = WindowsHelloVerificationStatus

function getStatusMessage(status: VerificationStatus): string {
  switch (status) {
    case 'canceled':
      return 'Verification was canceled.'
    case 'unavailable':
      return 'Windows Hello is unavailable on this device.'
    case 'not-configured':
      return 'Set up Windows Hello in Windows Settings first.'
    case 'disabled':
      return 'Windows Hello is disabled by your device policy.'
    case 'retries-exhausted':
      return 'Verification attempts were exhausted. Try again later.'
    case 'busy':
      return 'Windows Hello is currently busy. Try again.'
    default:
      return 'Windows Hello verification failed. Please try again.'
  }
}

export default function WindowsHelloSettings() {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function loadStatus() {
      try {
        const status = await window.electronAPI?.security.getStatus()

        if (!active || !status) {
          return
        }

        setSupported(status.supported)
        setEnabled(status.windowsHelloEnabled)
      } catch {
        if (active) {
          setMessage('Could not load security settings.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadStatus()

    return () => {
      active = false
    }
  }, [])

  async function toggleWindowsHello() {
    const api = window.electronAPI?.security

    if (!api || busy) {
      return
    }

    setBusy(true)
    setMessage('')

    try {
      const result = await api.setWindowsHelloEnabled(!enabled)

      setEnabled(result.enabled)

      if (result.verification !== 'verified') {
        setMessage(getStatusMessage(result.verification))
      } else {
        setMessage(
          result.enabled
            ? 'Windows Hello protection enabled.'
            : 'Windows Hello protection disabled.',
        )
      }
    } catch {
      setMessage('Could not update Windows Hello settings.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel settings-panel">
      <div className="panel-head">
        <div>
          <h3>Security</h3>
          <p>Protect access to your saved application session.</p>
        </div>
      </div>

      <div className="setting-row">
        <div>
          <strong>Windows Hello</strong>
          <p className="muted">
            Require Windows Hello verification before accessing your saved session.
          </p>
          <p className="muted">
            {loading
              ? 'Loading security settings...'
              : !supported
                ? 'Available in the Windows desktop application only.'
                : enabled
                  ? 'Protection is enabled.'
                  : 'Protection is currently disabled.'}
          </p>
        </div>

        <button
          type="button"
          className="soft-btn"
          onClick={toggleWindowsHello}
          disabled={!supported || loading || busy}
        >
          {busy
            ? 'Verifying...'
            : enabled
              ? 'Disable'
              : 'Enable'}
        </button>
      </div>

      {message && (
        <p className="muted" role="status">
          {message}
        </p>
      )}
    </section>
  )
}
