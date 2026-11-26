
from decimal import Decimal

from pydantic import ValidationError

from app.schemas import SavingsGoalUpdate


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
        "Update only goal name",
        lambda: SavingsGoalUpdate(name="New Bicycle"),
        True,
    ),
    (
        "Update only target",
        lambda: SavingsGoalUpdate(target=Decimal("15000")),
        True,
    ),
    (
        "Update only saved amount",
        lambda: SavingsGoalUpdate(saved=Decimal("5000")),
        True,
    ),
    (
        "Allow saved amount above target",
        lambda: SavingsGoalUpdate(
            target=Decimal("1000"),
            saved=Decimal("1500"),
        ),
        True,
    ),
    (
        "Reject zero target",
        lambda: SavingsGoalUpdate(target=Decimal("0")),
        False,
    ),
    (
        "Reject negative saved amount",
        lambda: SavingsGoalUpdate(saved=Decimal("-100")),
        False,
    ),
    (
        "Reject empty goal name",
        lambda: SavingsGoalUpdate(name=""),
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
        raise SystemExit("Savings goal partial-update validation failed.")

    print("Savings goal partial-update validation passed.")
