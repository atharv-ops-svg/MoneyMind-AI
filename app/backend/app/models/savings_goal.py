
from decimal import Decimal

from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Integer,
    Numeric,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    __table_args__ = (
        CheckConstraint(
            "target > 0",
            name="ck_savings_goals_target_positive",
        ),
        CheckConstraint(
            "saved >= 0",
            name="ck_savings_goals_saved_nonnegative",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    target: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    saved: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="savings_goals",
    )
