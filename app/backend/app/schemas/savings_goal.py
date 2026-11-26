
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class SavingsGoalBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    target: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    saved: Decimal = Field(ge=0, max_digits=12, decimal_places=2)


class SavingsGoalCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    target: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    saved: Decimal = Field(default=0, ge=0, max_digits=12, decimal_places=2)



class SavingsGoalUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    target: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    saved: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )



class SavingsGoalResponse(SavingsGoalBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
