
from app.schemas import RegisterRequest, LoginRequest


def run_test(name, condition):
    if condition:
        print(f"PASS: {name}")
        return True

    print(f"FAIL: {name}")
    return False


if __name__ == "__main__":
    registration = RegisterRequest(
        email=" USER@Example.COM ",
        password="securepassword123",
        country_code="IN",
    )

    login = LoginRequest(
        email=" USER@Example.COM ",
        password="securepassword123",
    )

    tests = [
        (
            "Registration email normalization",
            registration.email == "user@example.com",
        ),
        (
            "Login email normalization",
            login.email == "user@example.com",
        ),
        (
            "Already normalized email remains unchanged",
            RegisterRequest(
                email="user@example.com",
                password="securepassword123",
                country_code="IN",
            ).email == "user@example.com",
        ),
    ]

    passed = sum(
        run_test(name, condition)
        for name, condition in tests
    )

    print(f"\nResults: {passed}/{len(tests)} tests passed.")

    if passed != len(tests):
        raise SystemExit("Email normalization tests failed.")

    print("All email normalization tests passed.")
