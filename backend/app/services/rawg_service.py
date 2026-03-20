import httpx

from app.config import settings

client = httpx.AsyncClient(verify=False, timeout=10.0)


async def search_games(query: str, page: int = 1, page_size: int = 12) -> dict:
    response = await client.get(
        f"{settings.RAWG_BASE_URL}/games",
        params={
            "key": settings.RAWG_API_KEY,
            "search": query,
            "page": page,
            "page_size": page_size,
        },
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
    response = await client.get(
        f"{settings.RAWG_BASE_URL}/games/{rawg_id}",
        params={"key": settings.RAWG_API_KEY},
    )
    response.raise_for_status()
    game = response.json()

    screenshots = []
    resp = await client.get(
        f"{settings.RAWG_BASE_URL}/games/{rawg_id}/screenshots",
        params={"key": settings.RAWG_API_KEY},
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