from collections.abc import Generator

from sqlalchemy.orm import Session

from app.db.postgres import PostgresSessionLocal


def get_postgres_db() -> Generator[Session, None, None]:
    db = PostgresSessionLocal()

    try:
        yield db
    finally:
        db.close()