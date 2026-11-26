
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_postgres_db
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate,
)


router = APIRouter()


@router.post(
    "/",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    data: TransactionCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    transaction = Transaction(
        **data.model_dump(),
        user_id=current_user.id,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


@router.get("/", response_model=list[TransactionResponse])
def list_transactions(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    return db.scalars(
        select(Transaction)
        .where(Transaction.user_id == current_user.id)
        .order_by(Transaction.date.desc(), Transaction.id.desc())
    ).all()


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    transaction = db.scalar(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
    )

    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    return transaction


@router.patch("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    transaction = db.scalar(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
    )

    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    updates = data.model_dump(exclude_unset=True)

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Transaction fields cannot be null.",
        )

    for field, value in updates.items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)

    return transaction


@router.delete(
    "/{transaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_transaction(
    transaction_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    transaction = db.scalar(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
    )

    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    db.delete(transaction)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
