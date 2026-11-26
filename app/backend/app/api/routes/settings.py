from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_postgres_db
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings import (
    SettingsResponse,
    SettingsUpdate,
)


router = APIRouter()


@router.get(
    "/",
    response_model=SettingsResponse,
)
def get_settings(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_postgres_db),
    ],
):
    settings = db.scalar(
        select(UserSettings).where(
            UserSettings.user_id == current_user.id
        )
    )

    if settings is None:
        raise HTTPException(
            status_code=404,
            detail="User settings not found.",
        )

    return settings


@router.patch(
    "/",
    response_model=SettingsResponse,
)
def update_settings(
    data: SettingsUpdate,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_postgres_db),
    ],
):
    settings = db.scalar(
        select(UserSettings).where(
            UserSettings.user_id == current_user.id
        )
    )

    if settings is None:
        raise HTTPException(
            status_code=404,
            detail="User settings not found.",
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

    for field, value in updates.items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)

    return settings