
from datetime import date as Date
from decimal import Decimal
from typing import Literal
from app.schemas.categories import FinanceCategory

from pydantic import BaseModel, ConfigDict, Field


class TransactionBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    category: FinanceCategory
    date: Date
    amount: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )
    type: Literal["income", "expense"]


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    category: FinanceCategory | None = None

    date: Date | None = None

    amount: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    type: Literal["income", "expense"] | None = None


class TransactionResponse(TransactionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
