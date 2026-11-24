# MoneyMind AI — Desktop Application

The MoneyMind AI desktop application is designed to provide users with a dedicated environment for personal finance management.

## Technology Stack

- Electron — Desktop application framework
- React — User interface
- TypeScript — Application logic and type safety
- Vite — Development server and build tooling
- CSS — Styling and interface design

## Features

- Financial dashboard
- Transaction management
- Budget management
- Financial goals
- Reports and analytics
- AI assistant interface
- Application settings
- Local data storage

## Project Structure

    app/
    ├── electron/
    │   └── main.cjs
    │
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    │
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── common/
    │   │   └── layout/
    │   ├── context/
    │   ├── data/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── types/
    │   ├── utils/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.tsx
    │
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── README.md

## Installation

Make sure Node.js and npm are installed.

Navigate to the application directory:

    cd app

Install dependencies:

    npm install

## Running the Application

Start the development environment:

    npm run app:dev

## Building

Build the frontend:

    npm run build

## Data Storage

The application currently uses browser-based local storage for finance data.

Financial information is stored locally in the application environment.

## Development

The application is actively under development. Features, architecture, and functionality may change as development progresses.
