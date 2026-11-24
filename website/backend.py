"""
Optional Flask API starter for MoneyMind AI.
The browser demo works independently with LocalStorage; this file is an extension point
for a future server-backed version. This demo API stores data in a local SQLite database.
Do not deploy publicly without authentication, authorization, validation and security review.
"""
from flask import Flask, request, jsonify
import sqlite3, json
from pathlib import Path

app = Flask(__name__)
DB = Path(__file__).with_name("moneymind.db")

def connect():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    with connect() as con:
        con.execute("""CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL, amount REAL NOT NULL,
            kind TEXT NOT NULL CHECK(kind IN ('income','expense')),
            category TEXT NOT NULL, date TEXT NOT NULL)""")

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "app": "MoneyMind AI demo API"})

@app.get("/api/transactions")
def list_transactions():
    with connect() as con:
        rows = con.execute("SELECT * FROM transactions ORDER BY date DESC, id DESC").fetchall()
    return jsonify([dict(r) for r in rows])

@app.post("/api/transactions")
def add_transaction():
    body = request.get_json(silent=True) or {}
    required = ("description", "amount", "kind", "category", "date")
    if any(not body.get(k) for k in required):
        return jsonify({"error": "description, amount, kind, category and date are required"}), 400
    try:
        amount = float(body["amount"])
        if amount <= 0 or body["kind"] not in ("income", "expense"):
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({"error": "amount must be positive and kind must be income or expense"}), 400
    with connect() as con:
        cur = con.execute("INSERT INTO transactions(description,amount,kind,category,date) VALUES(?,?,?,?,?)",
                          (str(body["description"])[:120], amount, body["kind"], str(body["category"])[:40], str(body["date"])[:10]))
        row = con.execute("SELECT * FROM transactions WHERE id=?", (cur.lastrowid,)).fetchone()
    return jsonify(dict(row)), 201

@app.delete("/api/transactions/<int:transaction_id>")
def delete_transaction(transaction_id):
    with connect() as con:
        cur = con.execute("DELETE FROM transactions WHERE id=?", (transaction_id,))
    return jsonify({"deleted": cur.rowcount == 1})

if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5000, debug=True)
