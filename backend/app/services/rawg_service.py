import httpx

from app.config import settings

client = httpx.AsyncClient(verify=False, timeout=10.0)

STEAM_CAPSULE_URL = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{}/capsule_616x353.jpg"
STEAM_HEADER_URL = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{}/header.jpg"


def extract_steam_appid(stores: list | None) -> int | None:
    if not stores:
        return None
    for store in stores:
        s = store.get("store", {})
        if s.get("slug") == "steam" or s.get("id") == 1:
            url = store.get("url", "")
            parts = url.split("/app/")
            if len(parts) > 1:
                appid = parts[1].split("/")[0]
                if appid.isdigit():
                    return int(appid)
    return None


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

    results = []
    for game in data.get("results", []):
        steam_appid = extract_steam_appid(game.get("stores"))
        bg = game.get("background_image")

        if steam_appid:
            image = STEAM_CAPSULE_URL.format(steam_appid)
            fallback = bg
        else:
            image = bg
            fallback = None

        results.append({
            "rawg_id": game["id"],
            "title": game["name"],
            "image_url": image,
            "image_fallback": fallback,
            "released": game.get("released"),
            "metacritic": game.get("metacritic"),
            "genres": [g["name"] for g in game.get("genres", [])],
        })

    return {"count": data.get("count", 0), "results": results}


async def get_game_details(rawg_id: int) -> dict:
    response = await client.get(
        f"{settings.RAWG_BASE_URL}/games/{rawg_id}",
        params={"key": settings.RAWG_API_KEY},
    )
    response.raise_for_status()
    game = response.json()

    steam_appid = extract_steam_appid(game.get("stores"))
    bg = game.get("background_image")

    if steam_appid:
        image = STEAM_CAPSULE_URL.format(steam_appid)
        fallback = bg
    else:
        image = bg
        fallback = None

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
        "image_url": image,
        "image_fallback": fallback,
        "description": game.get("description_raw", ""),
        "released": game.get("released"),
        "metacritic": game.get("metacritic"),
        "genres": [g["name"] for g in game.get("genres", [])],
        "platforms": [p["platform"]["name"] for p in game.get("platforms", [])],
        "screenshots": screenshots[:6],
    }