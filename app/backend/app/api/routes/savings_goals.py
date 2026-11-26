
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_postgres_db
from app.models.savings_goal import SavingsGoal
from app.models.user import User
from app.schemas.savings_goal import (
    SavingsGoalCreate,
    SavingsGoalResponse,
    SavingsGoalUpdate,
)


router = APIRouter()


@router.post(
    "/",
    response_model=SavingsGoalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_savings_goal(
    data: SavingsGoalCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    goal = SavingsGoal(
        **data.model_dump(),
        user_id=current_user.id,
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal


@router.get("/", response_model=list[SavingsGoalResponse])
def list_savings_goals(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    return db.scalars(
        select(SavingsGoal)
        .where(SavingsGoal.user_id == current_user.id)
        .order_by(SavingsGoal.id)
    ).all()


@router.get("/{goal_id}", response_model=SavingsGoalResponse)
def get_savings_goal(
    goal_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    goal = db.scalar(
        select(SavingsGoal).where(
            SavingsGoal.id == goal_id,
            SavingsGoal.user_id == current_user.id,
        )
    )

    if goal is None:
        raise HTTPException(status_code=404, detail="Savings goal not found.")

    return goal


@router.patch("/{goal_id}", response_model=SavingsGoalResponse)
def update_savings_goal(
    goal_id: int,
    data: SavingsGoalUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    goal = db.scalar(
        select(SavingsGoal).where(
            SavingsGoal.id == goal_id,
            SavingsGoal.user_id == current_user.id,
        )
    )

    if goal is None:
        raise HTTPException(status_code=404, detail="Savings goal not found.")

    updates = data.model_dump(exclude_unset=True)

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Savings goal fields cannot be null.",
        )

    for field, value in updates.items():
        setattr(goal, field, value)

    db.commit()
    db.refresh(goal)

    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_savings_goal(
    goal_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    goal = db.scalar(
        select(SavingsGoal).where(
            SavingsGoal.id == goal_id,
            SavingsGoal.user_id == current_user.id,
        )
    )

    if goal is None:
        raise HTTPException(status_code=404, detail="Savings goal not found.")

    db.delete(goal)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
