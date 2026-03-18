from datetime import datetime

from pydantic import BaseModel, Field

from app.models.game import GameStatus


class GameCreate(BaseModel):
    rawg_id: int
    title: str = Field(max_length=255)
    image_url: str | None = None
    status: GameStatus = GameStatus.WISHLIST
    rating: int | None = Field(default=None, ge=1, le=5)
    notes: str | None = None


class GameUpdate(BaseModel):
    status: GameStatus | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    notes: str | None = None


class GameResponse(BaseModel):
    id: int
    rawg_id: int
    title: str
    image_url: str | None
    status: GameStatus
    rating: int | None
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}