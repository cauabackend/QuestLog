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
            for url_field in ("url", "url_en"):
                url = store.get(url_field, "")
                if url:
                    parts = url.split("/app/")
                    if len(parts) > 1:
                        appid = parts[1].strip("/").split("/")[0]
                        if appid.isdigit():
                            return int(appid)
    return None


def build_image_urls(game: dict, steam_appid: int | None) -> tuple[str | None, str | None]:
    bg = game.get("background_image")
    short = game.get("short_screenshots")
    screenshot_url = None
    if short and len(short) > 0:
        screenshot_url = short[0].get("image") if isinstance(short[0], dict) else None

    if steam_appid:
        return STEAM_CAPSULE_URL.format(steam_appid), bg or screenshot_url
    elif bg:
        return bg, screenshot_url
    elif screenshot_url:
        return screenshot_url, None
    return None, None


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
        image, fallback = build_image_urls(game, steam_appid)

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
    image, fallback = build_image_urls(game, steam_appid)

    screenshots = []
    resp = await client.get(
        f"{settings.RAWG_BASE_URL}/games/{rawg_id}/screenshots",
        params={"key": settings.RAWG_API_KEY},
    )
    if resp.status_code == 200:
        screenshots = [s["image"] for s in resp.json().get("results", [])]

    if not fallback and screenshots:
        fallback = screenshots[0]

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