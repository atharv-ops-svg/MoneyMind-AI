# MoneyMind AI

**Smarter financial management, powered by AI.**

MoneyMind AI is a personal finance management application designed to help users understand their finances, organize transactions, manage budgets, track savings goals, and make more informed financial decisions.

---

## Overview

MoneyMind AI combines a modern desktop interface with a dedicated backend and intelligent financial tools.

The project uses a modular architecture that separates the frontend, backend, native functionality, and application packaging.

## Features

- **Financial Dashboard** — View an overview of your financial activity.
- **Transaction Management** — Organize and manage income and expenses.
- **Budget Management** — Create and manage personal budgets.
- **Savings Goals** — Track progress towards financial goals.
- **Currency Support** — Work with different currencies.
- **AI Assistant** — Access intelligent financial assistance.
- **Account Management** — Register, sign in, and manage account settings.
- **Windows Hello Integration** — Support for Windows biometric authentication where available.
- **Customizable Settings** — Manage application preferences and appearance.

## Technology Stack

| Component                  | Technology               |
| -------------------------- | ------------------------ |
| Frontend                   | React                    |
| Programming Language       | TypeScript               |
| Build Tool                 | Vite                     |
| Desktop Framework          | Electron                 |
| Backend                    | Python, FastAPI          |
| Database                   | PostgreSQL               |
| ORM                        | SQLAlchemy               |
| Native Windows Integration | Rust                     |
| Authentication             | JWT-based authentication |

## Project Structure

```text
MoneyMind-AI/
│
├── README.md
├── .gitignore
│
└── app/
    ├── backend/
    │   └── app/
    │       ├── api/
    │       │   └── routes/
    │       ├── core/
    │       ├── db/
    │       ├── models/
    │       └── schemas/
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
    │
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── data/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   └── types/
    │
    ├── package.json
    └── package-lock.json
```

## Getting Started

### Prerequisites

Install the following development tools:

- Node.js and npm
- Python
- Rust and Cargo
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/atharv-ops-svg/MoneyMind-AI.git
cd MoneyMind-AI
```

### 2. Set up the frontend

```bash
cd app
npm install
```

### 3. Configure the backend

Navigate to:

```text
app/backend/
```

Configure the backend environment variables using the provided `.env.example` template, including your database connection and authentication settings.

Install the backend dependencies using the project's Python dependency configuration.

### 4. Configure PostgreSQL

Create a PostgreSQL database and configure its connection details in the backend environment.

### 5. Run the application

Start the FastAPI backend using its configured entry point.

In another terminal, navigate to `app/` and run:

```bash
npm run dev
```

Refer to the application scripts and backend configuration for the exact development and production commands.

## Building the Desktop Application

MoneyMind AI uses Electron to package its desktop application.

For Windows production builds, run:

```bash
npm run dist:win
```

Run this command from the `app/` directory after configuring the required native build tools and dependencies.

The generated installer can be distributed separately through GitHub Releases.

## Security

MoneyMind AI is designed with financial data protection in mind.

Security-related components include:

- Authenticated API requests.
- Password hashing.
- Token-based authentication.
- Protected backend routes.
- Secure Electron process communication.
- Optional Windows Hello integration.

Never commit passwords, API keys, database credentials, private certificates, or production environment files.

## Repository Guidelines

- Keep application source code inside `app/`.
- Keep backend functionality inside `app/backend/`.
- Keep Electron functionality inside `app/electron/`.
- Keep native Windows functionality inside `app/native/`.
- Keep frontend components and pages inside `app/src/`.
- Exclude generated build artifacts and local dependencies from Git.

## Contributing

Contributions, suggestions, and improvements are welcome.

When contributing:

1. Keep changes organized and modular.
2. Follow the existing project structure.
3. Test changes before submitting them.
4. Avoid committing generated files or sensitive information.

## License

Check the repository for the applicable license before redistributing or modifying the project.

---

**MoneyMind AI**  
_Understand your money. Make smarter decisions._
