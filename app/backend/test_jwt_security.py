from datetime import timedelta

from app.core.security import (
    create_access_token,
    decode_access_token,
)


def check(name, condition):
    if condition:
        print(f"PASS: {name}")
        return True

    print(f"FAIL: {name}")
    return False


if __name__ == "__main__":
    user_id = 123

    token = create_access_token(user_id)

    tests = [
        (
            "Token is generated",
            isinstance(token, str) and len(token) > 0,
        ),
        (
            "Valid token returns correct user ID",
            decode_access_token(token) == user_id,
        ),
        (
            "Invalid token is rejected",
            decode_access_token("invalid.token.value") is None,
        ),
        (
            "Modified token is rejected",
            decode_access_token(token + "modified") is None,
        ),
        (
            "Expired token is rejected",
            decode_access_token(
                create_access_token(
                    user_id,
                    expires_delta=timedelta(seconds=-1),
                )
            ) is None,
        ),
    ]

    passed = sum(
        check(name, condition)
        for name, condition in tests
    )

    print(f"\nResults: {passed}/{len(tests)} tests passed.")

    if passed != len(tests):
        raise SystemExit("JWT security tests failed.")

    print("All JWT security tests passed.")