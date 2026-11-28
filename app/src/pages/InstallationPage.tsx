
import {
  MonitorDown,
  Monitor,
  Download,
  ShieldCheck,
  Cpu,
  HardDrive,
  MemoryStick,
  CheckCircle2,
  Package,
  ArrowDownToLine,
  Info,
} from 'lucide-react'
import '../styles/installation.css'

const INSTALLER_URL =
  '/downloads/MoneyMind-AI-Setup-0.1.0.exe'

function InstallationPage() {
  const requirements = [
    {
      icon: Monitor,
      label: 'Operating System',
      value: 'Windows 10 or later',
    },
    {
      icon: Cpu,
      label: 'Processor',
      value: '64-bit compatible processor',
    },
    {
      icon: MemoryStick,
      label: 'Memory',
      value: '4 GB RAM minimum',
    },
    {
      icon: HardDrive,
      label: 'Storage',
      value: '500 MB available space',
    },
  ]

  const installationSteps = [
    {
      number: '01',
      title: 'Download the installer',
      description:
        'Download the official MoneyMind AI Windows installer using the download button below.',
    },
    {
      number: '02',
      title: 'Open the installer',
      description:
        'Locate the downloaded installer in your Downloads folder and open it.',
    },
    {
      number: '03',
      title: 'Complete installation',
      description:
        'Follow the installation wizard instructions to install MoneyMind AI.',
    },
    {
      number: '04',
      title: 'Launch MoneyMind AI',
      description:
        'Open MoneyMind AI from your Windows Start menu or desktop shortcut.',
    },
  ]

  return (
    <div className="page-container installation-page">
      <section className="installation-hero">
        <div className="installation-hero-content">
          <div className="installation-eyebrow">
            <MonitorDown size={16} />
            DESKTOP APPLICATION
          </div>

          <h1>
            Your finances.
            <br />
            <span>One intelligent workspace.</span>
          </h1>

          <p>
            Take MoneyMind AI to your Windows desktop.
            Manage transactions, track budgets, monitor
            savings goals, and explore your finances in
            one convenient application.
          </p>

          <div className="installation-actions">
            <a
              href={INSTALLER_URL}
              download="MoneyMind-AI-Setup-0.1.0.exe"
              className="installation-download-button"
            >
              <Download size={19} />
              Download for Windows
            </a>

            <span className="installation-status">
              <CheckCircle2 size={15} />
              Available Now
            </span>
          </div>

          <div className="installation-platform-note">
            <ShieldCheck size={16} />
            Official MoneyMind AI desktop release
          </div>
        </div>

        <div className="installation-hero-visual">
          <div className="installation-window">
            <div className="installation-window-header">
              <div className="installation-window-brand">
                <div className="installation-mini-logo">M</div>
                <span>MoneyMind AI</span>
              </div>

              <div className="installation-window-controls">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="installation-window-body">
              <div className="installation-preview-label">
                YOUR FINANCIAL OVERVIEW
              </div>

              <div className="installation-preview-title">
                Welcome back
              </div>

              <div className="installation-preview-balance">
                <span>Total Balance</span>
                <strong>₹••,•••</strong>
              </div>

              <div className="installation-preview-cards">
                <div>
                  <span>Income</span>
                  <b>₹••,•••</b>
                </div>
                <div>
                  <span>Expenses</span>
                  <b>₹••,•••</b>
                </div>
              </div>

              <div className="installation-preview-chart">
                <div className="installation-chart-heading">
                  Financial activity
                </div>

                <div className="installation-chart-bars">
                  {[35, 55, 42, 75, 53, 88, 65, 96, 72, 83, 60, 90].map(
                    (height, index) => (
                      <span
                        key={index}
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="installation-floating-icon">
            <MonitorDown size={27} />
          </div>
        </div>
      </section>

      <section className="installation-release-card">
        <div className="installation-release-icon">
          <Package size={25} />
        </div>

        <div className="installation-release-info">
          <h3>MoneyMind AI for Windows</h3>
          <p>
            Download the Windows desktop installer and
            get started with MoneyMind AI.
          </p>
        </div>

        <a
          href={INSTALLER_URL}
          download="MoneyMind-AI-Setup-0.1.0.exe"
          className="installation-download-button"
        >
          <Download size={17} />
          Download
        </a>
      </section>

      <section className="installation-section">
        <div className="installation-section-heading">
          <div>
            <span className="installation-section-label">
              GETTING STARTED
            </span>
            <h2>How to install</h2>
            <p>
              Four simple steps to get MoneyMind AI running
              on your Windows computer.
            </p>
          </div>
        </div>

        <div className="installation-steps">
          {installationSteps.map(step => (
            <div className="installation-step" key={step.number}>
              <div className="installation-step-number">
                {step.number}
              </div>

              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="installation-section">
        <div className="installation-section-heading">
          <div>
            <span className="installation-section-label">
              COMPATIBILITY
            </span>
            <h2>System requirements</h2>
            <p>
              The expected minimum requirements for the
              Windows desktop application.
            </p>
          </div>
        </div>

        <div className="installation-requirements">
          {requirements.map(item => {
            const Icon = item.icon

            return (
              <div
                className="installation-requirement"
                key={item.label}
              >
                <div className="installation-requirement-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>

                <CheckCircle2
                  className="installation-requirement-check"
                  size={18}
                />
              </div>
            )
          })}
        </div>

        <div className="installation-disclaimer">
          <Info size={18} />
          <p>
            These are preliminary requirements, not verified
            final specifications. Actual requirements will be
            published with the Windows release.
          </p>
        </div>
      </section>

      <section className="installation-bottom-banner">
        <div className="installation-bottom-icon">
          <ArrowDownToLine size={25} />
        </div>

        <div>
          <h2>MoneyMind AI for Windows</h2>
          <p>
            Download the desktop application and get started.
          </p>
        </div>

        <a
          href={INSTALLER_URL}
          download="MoneyMind-AI-Setup-0.1.0.exe"
          className="installation-download-button"
        >
          <Download size={17} />
          Download Now
        </a>
      </section>
    </div>
  )
}

export default InstallationPage