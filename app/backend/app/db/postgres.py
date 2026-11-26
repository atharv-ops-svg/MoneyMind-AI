
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings


settings = get_settings()

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg",
    username=settings.postgres_user,
    password=settings.postgres_password.get_secret_value(),
    host=settings.postgres_host,
    port=settings.postgres_port,
    database=settings.postgres_db,
)

postgres_engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

PostgresSessionLocal = sessionmaker(
    bind=postgres_engine,
    autoflush=False,
    expire_on_commit=False,
)
