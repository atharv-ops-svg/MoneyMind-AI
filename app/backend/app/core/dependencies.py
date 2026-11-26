from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.dependencies import get_postgres_db
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_postgres_db)],
) -> User:
    """Retrieve the authenticated user from a JWT."""

    unauthorized_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = decode_access_token(token)

    if user_id is None:
        raise unauthorized_error

    user = db.get(User, user_id)

    if user is None or not user.is_active:
        raise unauthorized_error

    return user