import httpx

from app.config import settings

STEAM_API_URL = "https://api.steampowered.com"


async def get_owned_games(steam_id: str) -> list[dict]:
    async with httpx.AsyncClient(verify=False, timeout=15.0) as client:
        response = await client.get(
            f"{STEAM_API_URL}/IPlayerService/GetOwnedGames/v1",
            params={
                "key": settings.STEAM_API_KEY,
                "steamid": steam_id,
                "include_appinfo": 1,
                "include_played_free_games": 0,
                "skip_unvetted_apps": 0,
            },
        )
        response.raise_for_status()
        data = response.json()

    games_raw = data.get("response", {}).get("games", [])

    games = []
    for game in games_raw:
        appid = game.get("appid")
        name = game.get("name", "")
        playtime = game.get("playtime_forever", 0)

        games.append({
            "steam_appid": appid,
            "title": name,
            "image_url": f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{appid}/capsule_616x353.jpg",
            "image_fallback": f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{appid}/header.jpg",
            "playtime_hours": round(playtime / 60, 1),
        })

    games.sort(key=lambda g: g["playtime_hours"], reverse=True)
    return games


async def get_player_summary(steam_id: str) -> dict | None:
    async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
        response = await client.get(
            f"{STEAM_API_URL}/ISteamUser/GetPlayerSummaries/v2",
            params={
                "key": settings.STEAM_API_KEY,
                "steamids": steam_id,
            },
        )
        response.raise_for_status()
        data = response.json()

    players = data.get("response", {}).get("players", [])
    if not players:
        return None

    player = players[0]
    return {
        "steam_id": player.get("steamid"),
        "name": player.get("personaname"),
        "avatar": player.get("avatarfull"),
        "profile_url": player.get("profileurl"),
    }