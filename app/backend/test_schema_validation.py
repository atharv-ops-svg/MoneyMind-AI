
from decimal import Decimal

from pydantic import ValidationError

from app.schemas import (
    RegisterRequest,
    TransactionCreate,
    BudgetCreate,
    SavingsGoalCreate,
    SettingsUpdate,
)


def run_test(name, test_function):
    try:
        test_function()
    except ValidationError:
        print(f"PASS: {name} rejected")
        return True

    print(f"FAIL: {name} was accepted")
    return False


tests = [
    (
        "Invalid email",
        lambda: RegisterRequest(
            email="not-an-email",
            password="securepassword123",
            country_code="IN",
        ),
    ),
    (
        "Short password",
        lambda: RegisterRequest(
            email="user@example.com",
            password="123",
            country_code="IN",
        ),
    ),
    (
        "Zero transaction amount",
        lambda: TransactionCreate(
            title="Test",
            category="Food",
            date="2026-11-25",
            amount=Decimal("0"),
            type="expense",
        ),
    ),
    (
        "Invalid transaction type",
        lambda: TransactionCreate(
            title="Test",
            category="Food",
            date="2026-11-25",
            amount=Decimal("100"),
            type="transfer",
        ),
    ),
    (
        "Negative budget",
        lambda: BudgetCreate(
            category="Food",
            amount=Decimal("-100"),
        ),
    ),
    (
        "Invalid savings target",
        lambda: SavingsGoalCreate(
            name="Bicycle",
            target=Decimal("0"),
            saved=Decimal("0"),
        ),
    ),
    (
        "Invalid theme",
        lambda: SettingsUpdate(
            profile="User",
            country_code="IN",
            currency="INR",
            theme="blue",
        ),
    ),
]


if __name__ == "__main__":
    passed = 0

    print("===== SCHEMA VALIDATION TESTS =====\n")

    for name, test_function in tests:
        if run_test(name, test_function):
            passed += 1

    print("\n===== RESULTS =====")
    print(f"Passed: {passed}/{len(tests)}")
    print(f"Failed: {len(tests) - passed}/{len(tests)}")

    if passed != len(tests):
        raise SystemExit("Schema validation tests failed.")

    print("\nAll invalid input tests passed.")
