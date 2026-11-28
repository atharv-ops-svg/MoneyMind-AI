
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_postgres_db
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings import SettingsResponse, SettingsUpdate


logger = logging.getLogger(__name__)

router = APIRouter()


def get_user_settings(db: Session, user_id: int) -> UserSettings:
    settings = db.scalar(
        select(UserSettings).where(UserSettings.user_id == user_id)
    )

    if settings is None:
        raise HTTPException(
            status_code=404,
            detail="User settings not found.",
        )

    return settings


@router.get("/", response_model=SettingsResponse)
def get_settings(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    return get_user_settings(
        db=db,
        user_id=current_user.id,
    )


@router.patch("/", response_model=SettingsResponse)
def update_settings(
    data: SettingsUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    settings = get_user_settings(
        db=db,
        user_id=current_user.id,
    )

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No settings were provided for update.",
        )

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Settings fields cannot be null.",
        )

    try:
        for field, value in updates.items():
            setattr(settings, field, value)

        db.commit()
        db.refresh(settings)

        return settings

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Failed to update settings for user ID %s",
            current_user.id,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to save settings. Please try again.",
        ) from None
