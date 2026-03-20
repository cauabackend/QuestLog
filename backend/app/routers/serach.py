from fastapi import APIRouter, Depends, HTTPException, Query
from httpx import HTTPStatusError
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services import rawg_service, game_service

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("/")
async def search_games(
    q: str = Query(min_length=2),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=40),
    db: Session = Depends(get_db),
):
    try:
        data = await rawg_service.search_games(q, page, page_size)
    except HTTPStatusError:
        raise HTTPException(status_code=502, detail="RAWG API unavailable")

    for game in data["results"]:
        existing = game_service.get_game_by_rawg_id(db, game["rawg_id"])
        game["in_library"] = existing is not None

    return data


@router.get("/{rawg_id}")
async def get_game_details(rawg_id: int, db: Session = Depends(get_db)):
    try:
        data = await rawg_service.get_game_details(rawg_id)
    except HTTPStatusError:
        raise HTTPException(status_code=502, detail="RAWG API unavailable")

    existing = game_service.get_game_by_rawg_id(db, rawg_id)
    data["in_library"] = existing is not None

    return data