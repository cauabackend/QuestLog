from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.game import Game, GameStatus
from app.schemas.game import GameCreate, GameUpdate


def get_games(
    db: Session,
    user_id: int,
    status: GameStatus | None = None,
    sort: str = "created_at",
    order: str = "desc",
) -> list[Game]:
    query = select(Game).where(Game.user_id == user_id)

    if status:
        query = query.where(Game.status == status)

    allowed_sorts = {"title": Game.title, "created_at": Game.created_at, "rating": Game.rating}
    sort_column = allowed_sorts.get(sort, Game.created_at)

    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    return list(db.scalars(query).all())


def get_game_by_id(db: Session, game_id: int, user_id: int) -> Game | None:
    query = select(Game).where(Game.id == game_id, Game.user_id == user_id)
    return db.scalars(query).first()


def get_game_by_rawg_id(db: Session, rawg_id: int, user_id: int) -> Game | None:
    query = select(Game).where(Game.rawg_id == rawg_id, Game.user_id == user_id)
    return db.scalars(query).first()


def create_game(db: Session, data: GameCreate, user_id: int) -> Game:
    game = Game(
        user_id=user_id,
        rawg_id=data.rawg_id,
        title=data.title,
        image_url=data.image_url,
        status=data.status,
        rating=data.rating,
        notes=data.notes,
    )
    db.add(game)
    db.commit()
    db.refresh(game)
    return game


def update_game(db: Session, game: Game, data: GameUpdate) -> Game:
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(game, field, value)
    db.commit()
    db.refresh(game)
    return game


def delete_game(db: Session, game: Game) -> None:
    db.delete(game)
    db.commit()