def create_mock_user(
    user_id: int = 1,
    is_active: bool = True,
) -> User:
    """Create a mock user for authentication tests."""

    user = User(
        id=user_id,
        email=f"user{user_id}@example.com",
        password_hash="mock_argon2_hash",
        is_active=is_active,
    )

    return user