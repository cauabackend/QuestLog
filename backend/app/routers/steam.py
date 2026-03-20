from fastapi import APIRouter, HTTPException, Query
from httpx import HTTPStatusError

from app.services import steam_service

router = APIRouter(prefix="/api/steam", tags=["steam"])


@router.get("/games/{steam_id}")
async def get_steam_games(steam_id: str):
    try:
        games = await steam_service.get_owned_games(steam_id)
    except HTTPStatusError:
        raise HTTPException(status_code=502, detail="Steam API unavailable")

    return {
        "count": len(games),
        "results": games,
    }


@router.get("/profile/{steam_id}")
async def get_steam_profile(steam_id: str):
    try:
        profile = await steam_service.get_player_summary(steam_id)
    except HTTPStatusError:
        raise HTTPException(status_code=502, detail="Steam API unavailable")

    if not profile:
        raise HTTPException(status_code=404, detail="Steam profile not found")

    return profile