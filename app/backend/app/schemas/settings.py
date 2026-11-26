
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.core.validators import CountryCode, CurrencyCode


class SettingsUpdate(BaseModel):
    profile: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    country_code: CountryCode | None = None

    currency: CurrencyCode | None = None

    theme: Literal["light", "dark"] | None = None


class SettingsResponse(BaseModel):
    id: int
    profile: str
    country_code: CountryCode
    currency: CurrencyCode
    theme: Literal["light", "dark"]

    model_config = ConfigDict(from_attributes=True)
