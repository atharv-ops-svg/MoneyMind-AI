
from fastapi import APIRouter

from app.api.routes import (
    auth,
    budgets,
    savings_goals,
    settings,
    transactions,
)


api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

api_router.include_router(
    transactions.router,
    prefix="/transactions",
    tags=["Transactions"],
)

api_router.include_router(
    budgets.router,
    prefix="/budgets",
    tags=["Budgets"],
)

api_router.include_router(
    savings_goals.router,
    prefix="/savings-goals",
    tags=["Savings Goals"],
)

api_router.include_router(
    settings.router,
    prefix="/settings",
    tags=["Settings"],
)


@api_router.get("/status", tags=["System"])
def api_status():
    return {
        "status": "operational",
        "service": "MoneyMind AI API",
    }
