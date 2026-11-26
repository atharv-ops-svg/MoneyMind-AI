
from typing import Annotated

from babel.numbers import get_territory_currencies
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.db.dependencies import get_postgres_db
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.auth import (
    RegisterRequest,
    TokenResponse,
    UserAuthResponse,
)


router = APIRouter()


@router.post(
    "/register",
    response_model=UserAuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: RegisterRequest,
    db: Annotated[Session, Depends(get_postgres_db)],
):
    email = str(data.email).strip().lower()

    existing_user = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    currencies = get_territory_currencies(
        data.country_code,
        tender=True,
    )

    if not currencies:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No default currency is available for this country.",
        )

    user = User(
        email=email,
        password_hash=hash_password(data.password),
    )

    try:
        db.add(user)
        db.flush()

        user_settings = UserSettings(
    user_id=user.id,
    profile=data.name,
    country_code=data.country_code,
    currency=currencies[0],
    theme="light",
)

        db.add(user_settings)
        db.commit()
        db.refresh(user)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    form_data: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
    db: Annotated[Session, Depends(get_postgres_db)],
):
    email = form_data.username.strip().lower()

    user = db.scalar(
        select(User).where(User.email == email)
    )

    if (
        user is None
        or not verify_password(
            form_data.password,
            user.password_hash,
        )
        or not user.is_active
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserAuthResponse,
)
def get_my_account(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
):
    return current_user


@router.post("/logout")
def logout(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
):
    return {
        "message": "Logout acknowledged. The client must discard its access token.",
        "token_valid_until_expiration": True,
    }
