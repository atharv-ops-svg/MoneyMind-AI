
from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserSettings(Base):
    __tablename__ = "user_settings"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            name="uq_user_settings_user_id",
        ),
        CheckConstraint(
            "length(country_code) = 2",
            name="ck_user_settings_country_code_length",
        ),
        CheckConstraint(
            "length(currency) = 3",
            name="ck_user_settings_currency_length",
        ),
        CheckConstraint(
            "theme IN ('light', 'dark')",
            name="ck_user_settings_theme_valid",
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

    profile: Mapped[str] = mapped_column(
        String(100),
        default="MoneyMind User",
        nullable=False,
    )

    country_code: Mapped[str] = mapped_column(
        String(2),
        nullable=False,
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
    )

    theme: Mapped[str] = mapped_column(
        String(10),
        default="light",
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="settings",
    )
