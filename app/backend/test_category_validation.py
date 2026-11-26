
from pydantic import ValidationError

from app.schemas import TransactionCreate, BudgetCreate


VALID_CATEGORIES = [
    "Food",
    "Shopping",
    "Transport",
    "Education",
    "Entertainment",
    "Other",
]


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


tests = []

for category in VALID_CATEGORIES:
    tests.append((
        f"Accept category: {category}",
        lambda category=category: TransactionCreate(
            title="Test",
            category=category,
            date="2026-11-25",
            amount=100,
            type="expense",
        ),
        True,
    ))

tests.extend([
    (
        "Reject unknown transaction category",
        lambda: TransactionCreate(
            title="Test",
            category="Healthcare",
            date="2026-11-25",
            amount=100,
            type="expense",
        ),
        False,
    ),
    (
        "Reject unknown budget category",
        lambda: BudgetCreate(
            category="Healthcare",
            amount=100,
        ),
        False,
    ),
    (
        "Accept valid budget category",
        lambda: BudgetCreate(
            category="Food",
            amount=100,
        ),
        True,
    ),
])


if __name__ == "__main__":
    passed = sum(
        check(name, callback, expected)
        for name, callback, expected in tests
    )

    print(f"\nResults: {passed}/{len(tests)} tests passed.")

    if passed != len(tests):
        raise SystemExit("Category validation failed.")

    print("All category validation tests passed.")
