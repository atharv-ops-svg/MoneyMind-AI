from collections.abc import Generator

from sqlalchemy.orm import Session

from app.db.sqlite import SQLiteSessionLocal


def get_sqlite_db() -> Generator[Session, None, None]:
    db = SQLiteSessionLocal()

    try:
        yield db
    finally:
        db.close()