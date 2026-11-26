
import pycountry

from typing import Annotated
from pydantic import AfterValidator


def validate_country_code(value: str) -> str:
    code = value.strip().upper()

    if pycountry.countries.get(alpha_2=code) is None:
        raise ValueError("Invalid ISO 3166-1 alpha-2 country code.")

    return code


def validate_currency_code(value: str) -> str:
    code = value.strip().upper()

    currency = pycountry.currencies.get(alpha_3=code)

    if currency is None:
        raise ValueError("Invalid ISO 4217 currency code.")

    # Reject special codes that do not represent usable currencies.
    if code in {"XXX", "XTS"}:
        raise ValueError("This is not a supported usable currency.")

    return code


CountryCode = Annotated[
    str,
    AfterValidator(validate_country_code),
]

CurrencyCode = Annotated[
    str,
    AfterValidator(validate_currency_code),
]
