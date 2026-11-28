
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_postgres_db
from app.models.user import User

router = APIRouter()


def ensure_table(db: Session):
    db.execute(text("""
        CREATE TABLE IF NOT EXISTS assistant_messages (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            role VARCHAR(20) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    """))
    db.commit()


@router.get("/history")
def get_history(
    db: Session = Depends(get_postgres_db),
    user: User = Depends(get_current_user),
):
    ensure_table(db)

    rows = db.execute(text("""
        SELECT role, content
        FROM assistant_messages
        WHERE user_id = :user_id
        ORDER BY id
    """), {"user_id": user.id}).mappings().all()

    return list(rows)


@router.post("/message")
def save_message(
    payload: dict,
    db: Session = Depends(get_postgres_db),
    user: User = Depends(get_current_user),
):
    ensure_table(db)

    for role in ("user", "assistant"):
        content = payload.get(role, "")
        if content:
            db.execute(text("""
                INSERT INTO assistant_messages (user_id, role, content)
                VALUES (:user_id, :role, :content)
            """), {
                "user_id": user.id,
                "role": role,
                "content": content,
            })

    db.commit()
    return {"status": "saved"}
