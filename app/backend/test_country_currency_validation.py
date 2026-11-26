
from pydantic import ValidationError

from app.schemas import RegisterRequest, SettingsUpdate


def run_test(name, test_function):
    try:
        test_function()
    except ValidationError:
        print(f"PASS: {name}")
        return True

    print(f"FAIL: {name}")
    return False


tests = [
    (
        "Valid country code",
        lambda: RegisterRequest(
            email="user@example.com",
            password="securepassword123",
            country_code="IN",
        ),
        True,
    ),
    (
        "Lowercase country normalization",
        lambda: RegisterRequest(
            email="user@example.com",
            password="securepassword123",
            country_code="in",
        ),
        True,
    ),
    (
        "Invalid country rejection",
        lambda: RegisterRequest(
            email="user@example.com",
            password="securepassword123",
            country_code="XX",
        ),
        False,
    ),
    (
        "Valid currency code",
        lambda: SettingsUpdate(
            profile="User",
            country_code="IN",
            currency="INR",
            theme="light",
        ),
        True,
    ),
    (
        "Lowercase currency normalization",
        lambda: SettingsUpdate(
            profile="User",
            country_code="IN",
            currency="inr",
            theme="light",
        ),
        True,
    ),
    (
        "Invalid currency rejection",
        lambda: SettingsUpdate(
            profile="User",
            country_code="IN",
            currency="XXX",
            theme="light",
        ),
        False,
    ),
    (
        "Independent currency selection",
        lambda: SettingsUpdate(
            profile="User",
            country_code="IN",
            currency="USD",
            theme="light",
        ),
        True,
    ),
]


if __name__ == "__main__":
    passed = 0

    for name, test_function, should_pass in tests:
        try:
            test_function()
            result = True
        except ValidationError:
            result = False

        if result == should_pass:
            print(f"PASS: {name}")
            passed += 1
        else:
            print(f"FAIL: {name}")

    print(f"\nResults: {passed}/{len(tests)} tests passed.")

    if passed != len(tests):
        raise SystemExit("Country/currency validation failed.")

    print("All country/currency validation tests passed.")
