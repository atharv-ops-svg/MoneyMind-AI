
# MoneyMind AI

## Development

Install the JavaScript dependencies with `npm install` and the backend
dependencies with `python -m pip install -r backend/requirements.txt`.
Configure `backend/.env` using `backend/.env.example`, and make sure PostgreSQL
is running with the configured database available.

Run `npm run app:dev` to build the Windows Hello helper and start the API,
Vite, and Electron together. The desktop app opens after the API health check
and Vite are available.
