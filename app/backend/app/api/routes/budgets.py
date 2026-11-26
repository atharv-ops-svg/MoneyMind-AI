
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_postgres_db
from app.models.budget import Budget
from app.models.user import User
from app.schemas.budget import (
    BudgetCreate,
    BudgetResponse,
    BudgetUpdate,
)


router = APIRouter()


@router.post(
    "/",
    response_model=BudgetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_budget(
    data: BudgetCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    budget = Budget(
        **data.model_dump(),
        user_id=current_user.id,
    )

    db.add(budget)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A budget already exists for this category.",
        )

    db.refresh(budget)
    return budget


@router.get("/", response_model=list[BudgetResponse])
def list_budgets(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    return db.scalars(
        select(Budget)
        .where(Budget.user_id == current_user.id)
        .order_by(Budget.category)
    ).all()


@router.get("/{budget_id}", response_model=BudgetResponse)
def get_budget(
    budget_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    budget = db.scalar(
        select(Budget).where(
            Budget.id == budget_id,
            Budget.user_id == current_user.id,
        )
    )

    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found.")

    return budget


@router.patch("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    data: BudgetUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    budget = db.scalar(
        select(Budget).where(
            Budget.id == budget_id,
            Budget.user_id == current_user.id,
        )
    )

    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found.")

    updates = data.model_dump(exclude_unset=True)

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Budget fields cannot be null.",
        )

    for field, value in updates.items():
        setattr(budget, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A budget already exists for this category.",
        )

    db.refresh(budget)
    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    budget = db.scalar(
        select(Budget).where(
            Budget.id == budget_id,
            Budget.user_id == current_user.id,
        )
    )

    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found.")

    db.delete(budget)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
