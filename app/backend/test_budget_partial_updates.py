
from decimal import Decimal

from pydantic import ValidationError

from app.schemas import BudgetUpdate


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
        "Update only budget amount",
        lambda: BudgetUpdate(amount=Decimal("3500.00")),
        True,
    ),
    (
        "Update only budget category",
        lambda: BudgetUpdate(category="Education"),
        True,
    ),
    (
        "Update multiple budget fields",
        lambda: BudgetUpdate(
            category="Food",
            amount=Decimal("4000.00"),
        ),
        True,
    ),
    (
        "Allow zero budget",
        lambda: BudgetUpdate(amount=Decimal("0")),
        True,
    ),
    (
        "Reject negative budget",
        lambda: BudgetUpdate(amount=Decimal("-100")),
        False,
    ),
    (
        "Reject empty category",
        lambda: BudgetUpdate(category=""),
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
        raise SystemExit("Budget partial-update validation failed.")

    print("Budget partial-update validation passed.")
