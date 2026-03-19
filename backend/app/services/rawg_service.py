import httpx

from app.config import settings


async def search_games(query: str, page: int = 1, page_size: int = 12) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.RAWG_BASE_URL}/games",
            params={
                "key": settings.RAWG_API_KEY,
                "search": query,
                "page": page,
                "page_size": page_size,
            },
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()

    results = [
        {
            "rawg_id": game["id"],
            "title": game["name"],
            "image_url": game.get("background_image"),
            "released": game.get("released"),
            "metacritic": game.get("metacritic"),
            "genres": [g["name"] for g in game.get("genres", [])],
        }
        for game in data.get("results", [])
    ]

    return {"count": data.get("count", 0), "results": results}


async def get_game_details(rawg_id: int) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.RAWG_BASE_URL}/games/{rawg_id}",
            params={"key": settings.RAWG_API_KEY},
            timeout=10.0,
        )
        response.raise_for_status()
        game = response.json()

    screenshots = []
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.RAWG_BASE_URL}/games/{rawg_id}/screenshots",
            params={"key": settings.RAWG_API_KEY},
            timeout=10.0,
        )
        if resp.status_code == 200:
            screenshots = [s["image"] for s in resp.json().get("results", [])]

    return {
        "rawg_id": game["id"],
        "title": game["name"],
        "image_url": game.get("background_image"),
        "description": game.get("description_raw", ""),
        "released": game.get("released"),
        "metacritic": game.get("metacritic"),
        "genres": [g["name"] for g in game.get("genres", [])],
        "platforms": [p["platform"]["name"] for p in game.get("platforms", [])],
        "screenshots": screenshots[:6],
    }