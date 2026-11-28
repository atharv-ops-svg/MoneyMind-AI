# MoneyMind AI

**Understand your money. Make smarter decisions.**

MoneyMind AI is an AI-powered personal finance management application designed to help people organize their finances, track transactions, manage budgets, monitor savings goals, and make more informed financial decisions.

Built with a modern technology stack, MoneyMind AI combines a React and TypeScript frontend, an Electron desktop environment, a Python backend, and native Windows integration.

---

## Overview

MoneyMind AI aims to make personal financial management more accessible, organized, and intelligent.

The application brings essential financial tools together in one place, with an AI assistant designed to provide additional support for understanding and managing finances.

## Features

- **Financial Dashboard** — Get an overview of your financial activity.
- **Transaction Management** — Manage and organize income and expenses.
- **Budget Management** — Create and monitor personal budgets.
- **Savings Goals** — Set savings goals and track progress.
- **Currency Support** — Work with multiple currencies.
- **AI Assistant** — Access AI-powered financial assistance.
- **Account Management** — Register, sign in, and manage your account.
- **Windows Hello Integration** — Support for Windows biometric authentication.
- **Application Settings** — Customize available application preferences.

_Feature availability may depend on the current application build and backend configuration._

---

## Technology Stack

| Component                  | Technology               |
| -------------------------- | ------------------------ |
| Frontend                   | React                    |
| Language                   | TypeScript               |
| Build Tool                 | Vite                     |
| Desktop Framework          | Electron                 |
| Backend                    | Python                   |
| API Framework              | FastAPI                  |
| Database                   | PostgreSQL               |
| ORM                        | SQLAlchemy               |
| Native Windows Integration | Rust                     |
| Authentication             | JWT-based authentication |

---

## Project Structure

```text
MoneyMind-AI/
│
├── .gitignore
├── README.md
│
└── app/
    │
    ├── backend/
    │   ├── app/
    │   │   ├── api/
    │   │   │   └── routes/
    │   │   ├── core/
    │   │   ├── db/
    │   │   ├── models/
    │   │   └── schemas/
    │   ├── alembic/
    │   ├── alembic.ini
    │   └── requirements.txt
    │
    ├── electron/
    │   ├── main.cjs
    │   └── preload.cjs
    │
    ├── native/
    │   └── windows-hello/
    │       ├── src/
    │       ├── Cargo.toml
    │       └── Cargo.lock
    │
    ├── public/
    │   └── downloads/
    │
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── data/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── types/
    │   └── utils/
    │
    ├── .env.example
    ├── package.json
    ├── package-lock.json
    ├── index.html
    └── vite.config.ts
```

---

## Getting Started

### Prerequisites

Install the following development tools:

- Node.js
- npm
- Python
- Rust and Cargo
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/atharv-ops-svg/MoneyMind-AI.git
cd MoneyMind-AI
```

### 2. Install Frontend Dependencies

```bash
cd app
npm install
```

### 3. Configure Environment Variables

Configure the required environment variables using the provided `.env.example` files.

Backend configuration should include:

- Database connection URL
- Authentication settings
- Secret keys
- Other required application settings

Never commit actual environment files or credentials.

### 4. Configure PostgreSQL

Create a PostgreSQL database and configure its connection URL in the backend environment.

### 5. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 6. Run the Backend

From the backend directory, start the FastAPI development server using the project's configured entry point.

For the standard `app.main:app` entry point:

```bash
uvicorn app.main:app --reload
```

### 7. Run the Frontend

Open another terminal and navigate to the application directory:

```bash
cd app
npm run dev
```

The Vite development server will display its local URL in the terminal.

---

## Building the Desktop Application

MoneyMind AI uses Electron to package the desktop application.

For Windows production builds, run the following command from the `app/` directory:

```bash
npm run dist:win
```

This build process includes:

1. Building the native Windows integration.
2. Building the React frontend.
3. Packaging the Electron application.
4. Generating the Windows installer.
5. Copying the installer into the configured downloads directory.

The generated installer can be distributed separately through GitHub Releases.

---

## Security

MoneyMind AI is designed with financial data protection in mind.

Security-related components include:

- Password hashing.
- JWT-based authentication.
- Protected backend routes.
- Authenticated API requests.
- Secure Electron process communication.
- Windows Hello integration.

Never commit:

- Passwords or API keys.
- Database credentials.
- Private certificates.
- Production environment files.
- Other sensitive information.

---

## Repository Guidelines

- Keep application source code inside `app/`.
- Keep backend functionality inside `app/backend/`.
- Keep Electron functionality inside `app/electron/`.
- Keep native Windows functionality inside `app/native/`.
- Keep frontend components and pages inside `app/src/`.
- Exclude generated build artifacts and local dependencies from Git.
- Keep sensitive configuration files out of version control.

---

## Contributing

Contributions, suggestions, and improvements are welcome.

When contributing:

1. Keep changes organized and modular.
2. Follow the existing project structure.
3. Test changes before submitting them.
4. Avoid committing generated files or sensitive information.
5. Provide clear descriptions of changes.

---

## License

Check the repository for the applicable license before redistributing or modifying the project.

---

**MoneyMind AI**

_Understand your money. Make smarter decisions._
