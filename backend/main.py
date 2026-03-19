from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import Game  # noqa: F401 — garante que o modelo é registrado
from app.routers import games, search


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="QuestLog API",
    description="API do QuestLog — site para gerenciar sua biblioteca de jogos",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games.router)
app.include_router(search.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "site": "QuestLog"}