
from app.core.security import (
    hash_password,
    verify_password,
    needs_rehash,
)


def check(name, condition):
    if condition:
        print(f"PASS: {name}")
        return True

    print(f"FAIL: {name}")
    return False


if __name__ == "__main__":
    password = "securepassword123"

    hashed_password = hash_password(password)

    tests = [
        (
            "Password is hashed",
            hashed_password != password,
        ),
        (
            "Argon2 hash format",
            hashed_password.startswith("$argon2id$"),
        ),
        (
            "Correct password verification",
            verify_password(password, hashed_password),
        ),
        (
            "Incorrect password rejection",
            not verify_password("wrongpassword", hashed_password),
        ),
        (
            "Empty password rejection",
            not verify_password("", hashed_password),
        ),
        (
            "Rehash check",
            not needs_rehash(hashed_password),
        ),
    ]

    passed = sum(
        check(name, condition)
        for name, condition in tests
    )

    print(f"\nResults: {passed}/{len(tests)} tests passed.")

    if passed != len(tests):
        raise SystemExit("Password security tests failed.")

    print("All password security tests passed.")
