
from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker


BACKEND_DIR = Path(__file__).resolve().parents[2]
LOCAL_DATA_DIR = BACKEND_DIR / "local_data"

LOCAL_DATA_DIR.mkdir(parents=True, exist_ok=True)

SQLITE_DATABASE_PATH = LOCAL_DATA_DIR / "moneymind_local.db"

SQLITE_DATABASE_URL = (
    f"sqlite:///{SQLITE_DATABASE_PATH.as_posix()}"
)

sqlite_engine = create_engine(
    SQLITE_DATABASE_URL,
    connect_args={"check_same_thread": False},
)


@event.listens_for(sqlite_engine, "connect")
def enable_sqlite_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SQLiteSessionLocal = sessionmaker(
    bind=sqlite_engine,
    autoflush=False,
    expire_on_commit=False,
)
