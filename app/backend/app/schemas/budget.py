
from decimal import Decimal
from app.schemas.categories import FinanceCategory

from pydantic import BaseModel, ConfigDict, Field


class BudgetBase(BaseModel):
    category: FinanceCategory
    amount: Decimal = Field(ge=0, max_digits=12, decimal_places=2)


class BudgetCreate(BudgetBase):
    pass



class BudgetUpdate(BaseModel):
    category: FinanceCategory | None = None

    amount: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )



class BudgetResponse(BudgetBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
