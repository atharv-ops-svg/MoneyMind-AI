
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import (
    InvalidHashError,
    VerificationError,
    VerifyMismatchError,
)
from jwt.exceptions import InvalidTokenError

from app.core.config import get_settings


password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash a plaintext password using Argon2id."""

    return password_hasher.hash(password)


def get_password_hash(password: str) -> str:
    """Compatibility wrapper for password hashing."""

    return hash_password(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """Verify a plaintext password against its Argon2 hash."""

    try:
        return password_hasher.verify(
            hashed_password,
            plain_password,
        )

    except (
        VerifyMismatchError,
        VerificationError,
        InvalidHashError,
    ):
        return False


def needs_rehash(hashed_password: str) -> bool:
    """Check whether a password hash needs updating."""

    try:
        return password_hasher.check_needs_rehash(
            hashed_password
        )

    except InvalidHashError:
        return True


def create_access_token(
    user_id: int,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a signed JWT access token for a user."""

    settings = get_settings()

    if user_id <= 0:
        raise ValueError("User ID must be positive.")

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=settings.access_token_expire_minutes
        )

    expire = datetime.now(timezone.utc) + expires_delta

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> int | None:
    """Verify a JWT and return its user ID, or None if invalid."""

    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
            options={"require": ["sub", "exp"]},
        )

        user_id = int(payload["sub"])

        if user_id <= 0:
            return None

        return user_id

    except (InvalidTokenError, ValueError, TypeError, KeyError):
        return None
