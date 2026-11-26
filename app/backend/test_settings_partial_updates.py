
from pydantic import ValidationError

from app.schemas import SettingsUpdate


def check(name, callback, should_pass):
    try:
        callback()
        passed = True
    except ValidationError:
        passed = False

    if passed == should_pass:
        print(f"PASS: {name}")
        return True

    print(f"FAIL: {name}")
    return False


tests = [
    (
        "Update only theme",
        lambda: SettingsUpdate(theme="dark"),
        True,
    ),
    (
        "Update only profile",
        lambda: SettingsUpdate(profile="New Profile"),
        True,
    ),
    (
        "Update only currency",
        lambda: SettingsUpdate(currency="USD"),
        True,
    ),
    (
        "Update multiple settings",
        lambda: SettingsUpdate(
            theme="dark",
            currency="USD",
        ),
        True,
    ),
    (
        "Normalize lowercase currency",
        lambda: SettingsUpdate(currency="usd").currency == "USD",
        True,
    ),
    (
        "Reject invalid currency",
        lambda: SettingsUpdate(currency="INVALID"),
        False,
    ),
    (
        "Reject invalid country",
        lambda: SettingsUpdate(country_code="XX"),
        False,
    ),
    (
        "Reject invalid theme",
        lambda: SettingsUpdate(theme="blue"),
        False,
    ),
    (
        "Reject empty profile",
        lambda: SettingsUpdate(profile=""),
        False,
    ),
]


if __name__ == "__main__":
    passed = sum(
        check(name, callback, expected)
        for name, callback, expected in tests
    )

    print(f"\nResults: {passed}/{len(tests)} tests passed.")

    if passed != len(tests):
        raise SystemExit("Settings partial-update validation failed.")

    print("Settings partial-update validation passed.")
