from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.game import GameStatus
from app.schemas.game import GameCreate, GameUpdate, GameResponse
from app.services import game_service

router = APIRouter(prefix="/api/games", tags=["games"])


@router.get("", response_model=list[GameResponse])
def list_games(
    status: GameStatus | None = Query(default=None),
    sort: str = Query(default="created_at", pattern="^(title|created_at|rating)$"),
    order: str = Query(default="desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return game_service.get_games(db, user_id=current_user.id, status=status, sort=sort, order=order)


@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    game = game_service.get_game_by_id(db, game_id, user_id=current_user.id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.post("", response_model=GameResponse, status_code=201)
def add_game(data: GameCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = game_service.get_game_by_rawg_id(db, data.rawg_id, user_id=current_user.id)
    if existing:
        raise HTTPException(status_code=409, detail="Game already in library")
    return game_service.create_game(db, data, user_id=current_user.id)


@router.patch("/{game_id}", response_model=GameResponse)
def update_game(game_id: int, data: GameUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    game = game_service.get_game_by_id(db, game_id, user_id=current_user.id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game_service.update_game(db, game, data)


@router.delete("/{game_id}", status_code=204)
def remove_game(game_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    game = game_service.get_game_by_id(db, game_id, user_id=current_user.id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    game_service.delete_game(db, game)