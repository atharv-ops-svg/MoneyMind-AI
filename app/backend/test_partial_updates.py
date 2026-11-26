
from datetime import date
from decimal import Decimal

from pydantic import ValidationError

from app.schemas import TransactionUpdate


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
        "Update only transaction title",
        lambda: TransactionUpdate(title="Updated Lunch"),
        True,
    ),
    (
        "Update only transaction amount",
        lambda: TransactionUpdate(amount=Decimal("500.00")),
        True,
    ),
    (
        "Update multiple fields",
        lambda: TransactionUpdate(
            title="Updated Supplies",
            amount=Decimal("1500.00"),
        ),
        True,
    ),
    (
        "Reject zero transaction amount",
        lambda: TransactionUpdate(amount=Decimal("0")),
        False,
    ),
    (
        "Reject invalid transaction type",
        lambda: TransactionUpdate(type="transfer"),
        False,
    ),
    (
        "Reject empty transaction title",
        lambda: TransactionUpdate(title=""),
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
        raise SystemExit("Partial update validation failed.")

    print("Transaction partial-update validation passed.")
