
from sqlalchemy import text

from app.db.postgres import postgres_engine
from app.db.sqlite import sqlite_engine


def test_postgresql():
    with postgres_engine.connect() as connection:
        result = connection.execute(
            text("SELECT current_database(), current_user")
        )
        database, user = result.one()

        print("PostgreSQL: CONNECTED")
        print(f"Database: {database}")
        print(f"User: {user}")


def test_sqlite():
    with sqlite_engine.connect() as connection:
        connection.execute(text("SELECT 1"))

        foreign_keys = connection.execute(
            text("PRAGMA foreign_keys")
        ).scalar_one()

        print("SQLite: CONNECTED")
        print(f"Foreign keys enabled: {bool(foreign_keys)}")


if __name__ == "__main__":
    try:
        test_postgresql()
        test_sqlite()
        print("\nBoth database connections are working.")

    except Exception:
        print("\nDatabase connection test failed.")
        raise

    finally:
        postgres_engine.dispose()
        sqlite_engine.dispose()