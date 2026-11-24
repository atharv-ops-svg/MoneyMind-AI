MONEYMIND AI — WORKING DEMO
===========================

INSTANT DEMO (no installation)
1. Extract the ZIP folder.
2. Double-click index.html.
3. The app opens in your browser. Internet is only needed for Google Fonts and Chart.js CDN charts; the rest of the interface and finance logic run locally.
4. Try adding income/expenses, editing/deleting records, setting category budgets, creating goals, asking the rule-based assistant, switching currency/theme, and exporting CSV. The app includes live charts for cash flow, category spending, monthly trends, budget-vs-spending, and savings-goal progress; charts update when records change.

WHAT IS INCLUDED
- index.html: app structure and all pages
- styles.css: responsive UI design and light/dark themes
- app.js: transaction engine, calculations, dashboard + monthly + category + budget + savings charts, rule-based assistant and LocalStorage persistence
- backend.py: optional Flask + SQLite API starter
- requirements.txt: Python backend dependency

OPTIONAL PYTHON BACKEND
The supplied report describes the current prototype as HTML/CSS/JavaScript + Chart.js + LocalStorage, without a separate backend. To provide a Python database starter as requested, backend.py adds a small local Flask/SQLite API. It is not connected to the browser demo by default; the demo opens instantly without a server.

To run the optional API:
  python -m venv .venv
  Windows: .venv\\Scripts\\activate
  macOS/Linux: source .venv/bin/activate
  pip install -r requirements.txt
  python backend.py
Then open http://127.0.0.1:5000/api/health

API endpoints:
  GET  /api/health
  GET  /api/transactions
  POST /api/transactions
  DELETE /api/transactions/<id>

IMPORTANT LIMITATIONS
- The assistant is rule-based demonstration logic, not a connected AI model.
- LocalStorage is local to this browser/device and is not a secure cloud database.
- The optional SQLite API has no login/authentication and is for local learning only.
- Do not enter bank passwords, PINs, OTPs, card security codes or confidential banking credentials.
- This is an educational organization tool, not professional financial advice.
- A real deployment needs secure authentication, server-side validation, access controls, encryption, backups, privacy review and security testing.

PROJECT BASIS
Designed around the MoneyMind AI Hackathon Project Report: dashboard, transaction management, category budgets, financial assistant concept, savings goals, reports/charts, settings, and the report's stated technology and limitations.
