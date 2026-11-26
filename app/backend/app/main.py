
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.router import api_router
from app.db.dependencies import get_postgres_db
from app.db.sqlite_dependencies import get_sqlite_db


app = FastAPI(
    title="MoneyMind AI API",
    description="Backend API for the MoneyMind AI desktop application.",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register all versioned API routes
app.include_router(
    api_router,
    prefix="/api/v1",
)


# Root endpoint
@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Welcome to MoneyMind AI API",
        "status": "running",
    }


# General health check
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "MoneyMind AI API",
    }


# Database health check
@app.get("/health/databases", tags=["Health"])
def database_health_check(
    postgres_db: Annotated[
        Session,
        Depends(get_postgres_db),
    ],
    sqlite_db: Annotated[
        Session,
        Depends(get_sqlite_db),
    ],
):
    postgres_db.execute(text("SELECT 1")).scalar_one()
    sqlite_db.execute(text("SELECT 1")).scalar_one()

    return {
        "status": "healthy",
        "databases": {
            "postgresql": "connected",
            "sqlite": "connected",
        },
    }
