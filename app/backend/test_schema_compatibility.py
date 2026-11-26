
from datetime import date
from decimal import Decimal

from app.models import (
    User,
    Transaction,
    Budget,
    SavingsGoal,
    UserSettings,
)

from app.schemas import (
    UserResponse,
    UserAuthResponse,
    TransactionResponse,
    BudgetResponse,
    SavingsGoalResponse,
    SettingsResponse,
)


def test_model_schema(name, model, schema):
    result = schema.model_validate(model)

    print(f"PASS: {name}")
    return result


if __name__ == "__main__":
    print("===== SQLALCHEMY / PYDANTIC COMPATIBILITY =====\n")

    user = User(
        id=1,
        email="user@example.com",
        is_active=True,
    )

    transaction = Transaction(
        id=1,
        user_id=1,
        title="School Supplies",
        category="Education",
        date=date(2026, 11, 25),
        amount=Decimal("1200.00"),
        type="expense",
    )

    budget = Budget(
        id=1,
        user_id=1,
        category="Food",
        amount=Decimal("3000.00"),
    )

    savings_goal = SavingsGoal(
        id=1,
        user_id=1,
        name="New Bicycle",
        target=Decimal("12000.00"),
        saved=Decimal("4500.00"),
    )

    settings = UserSettings(
        id=1,
        user_id=1,
        profile="MoneyMind User",
        country_code="IN",
        currency="INR",
        theme="light",
    )

    test_model_schema("UserResponse", user, UserResponse)
    test_model_schema("UserAuthResponse", user, UserAuthResponse)
    test_model_schema(
        "TransactionResponse",
        transaction,
        TransactionResponse,
    )
    test_model_schema("BudgetResponse", budget, BudgetResponse)
    test_model_schema(
        "SavingsGoalResponse",
        savings_goal,
        SavingsGoalResponse,
    )
    test_model_schema("SettingsResponse", settings, SettingsResponse)

    print("\nAll six model-schema compatibility tests passed.")
