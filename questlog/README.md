# QuestLog

Biblioteca pessoal de jogos com integracao Steam e busca via RAWG.io.

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![Steam](https://img.shields.io/badge/Steam_API-integrated-1B2838?logo=steam&logoColor=white)

---

## Sobre

QuestLog organiza sua colecao de jogos em um so lugar. Conecte sua conta Steam pra ver seus jogos comprados com horas jogadas, busque novos jogos pelo nome e acompanhe o que esta jogando, o que ja zerou e o que quer jogar.

Projeto full-stack construido como portfolio, demonstrando: API REST com FastAPI, banco de dados com SQLAlchemy, consumo de duas APIs externas (RAWG.io + Steam), e frontend React com interface dark mode.

### Funcionalidades

- Integracao com Steam: importa automaticamente todos os jogos comprados com horas jogadas
- Busca de jogos via RAWG.io com debounce (catalogo de 800k+ jogos)
- CRUD completo: adicionar, editar status e nota, remover jogos
- Filtros por fonte (QuestLog / Steam) e por status (jogando, zerado, na fila, largado)
- Dashboard com hero do jogo atual, estatisticas e atividade recente
- Pagina de detalhes com descricao, screenshots, generos e plataformas
- Interface dark mode com glassmorphism (preto, vermelho, cinza)

---

## Stack

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| Backend | Python 3.13 + FastAPI | API REST com validacao automatica |
| ORM | SQLAlchemy 2.0 | Mapeamento objeto-relacional |
| Banco | SQLite | Persistencia local sem setup |
| Validacao | Pydantic v2 | Schemas de entrada e saida |
| HTTP Client | httpx | Chamadas assincronas a RAWG e Steam |
| Frontend | React 19 + Vite | Interface reativa com hot reload |
| Estilizacao | Tailwind CSS 4 | Utility-first CSS |
| Roteamento | React Router v6 | Navegacao SPA |

---

## Como rodar localmente

### Pre-requisitos

- Python 3.10+
- Node.js 18+
- API key da [RAWG.io](https://rawg.io/apidocs) (gratuita)
- API key da [Steam](https://steamcommunity.com/dev/apikey) (gratuita, precisa de conta Steam)

### Backend

```bash
cd backend
python -m venv venv

# Linux/Mac
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Crie o arquivo `.env` na pasta `backend/`:

```
RAWG_API_KEY=sua_key_rawg
STEAM_API_KEY=sua_key_steam
DATABASE_URL=sqlite:///./questlog.db
```

Inicie o servidor:

```bash
uvicorn main:app --reload
```

O backend roda em `http://localhost:8000`. Documentacao interativa em `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env` na pasta `frontend/`:

```
VITE_API_URL=http://localhost:8000
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend roda em `http://localhost:5173`.

---

## Endpoints da API

### Biblioteca (CRUD)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/games` | Listar jogos da biblioteca |
| GET | `/api/games/:id` | Detalhes de um jogo salvo |
| POST | `/api/games` | Adicionar jogo a biblioteca |
| PATCH | `/api/games/:id` | Atualizar status, nota ou anotacoes |
| DELETE | `/api/games/:id` | Remover jogo da biblioteca |

### Busca (proxy RAWG.io)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/search?q=termo` | Buscar jogos no catalogo RAWG |
| GET | `/api/search/:rawg_id` | Detalhes completos via RAWG |

### Steam

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/steam/games/:steam_id` | Jogos comprados do usuario |
| GET | `/api/steam/profile/:steam_id` | Perfil publico do usuario |

---

## Estrutura do projeto

```
questlog/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── config.py
│       ├── database.py
│       ├── dependencies.py
│       ├── models/game.py
│       ├── schemas/game.py
│       ├── routers/
│       │   ├── games.py
│       │   ├── search.py
│       │   └── steam.py
│       └── services/
│           ├── game_service.py
│           ├── rawg_service.py
│           └── steam_service.py
│
├── frontend/
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── services/api.js
│       ├── hooks/useDebounce.js
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Layout.jsx
│       │   ├── GameCard.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── SearchBar.jsx
│       │   └── LoadingSkeleton.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Search.jsx
│           ├── Library.jsx
│           └── GameDetail.jsx
│
└── README.md
```

---

## Deploy

### Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com) e conecte sua conta GitHub
2. Importe o repositorio `questlog`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione a variavel de ambiente:
   - `VITE_API_URL` = URL do backend no Render (passo abaixo)
5. Clique em Deploy

### Backend (Render)

1. Acesse [render.com](https://render.com) e conecte sua conta GitHub
2. Crie um novo **Web Service**
3. Selecione o repositorio `questlog`
4. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Adicione as variaveis de ambiente:
   - `RAWG_API_KEY` = sua key
   - `STEAM_API_KEY` = sua key
   - `DATABASE_URL` = `sqlite:///./questlog.db`
6. Clique em Create Web Service
7. Copie a URL gerada (ex: `https://questlog-api.onrender.com`)
8. Volte no Vercel e atualize `VITE_API_URL` com essa URL

### Apos o deploy

- Atualize o CORS no `main.py` para incluir o dominio do Vercel:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://questlog.vercel.app",  # seu dominio real
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Decisoes tecnicas

**Imagens via Steam CDN** — Jogos que existem na Steam usam a `capsule_616x353.jpg` em vez das screenshots da RAWG. O backend extrai o Steam appid e monta a URL. Resultado: capas oficiais em resolucao consistente.

**Backend como proxy** — O frontend nunca acessa RAWG ou Steam diretamente. As API keys ficam no servidor.

**GameCard unificado** — Um unico componente renderiza jogos RAWG e Steam. Detecta a fonte pelo campo `steam_appid` e adapta badges, links e acoes.

**PATCH com exclude_unset** — Permite enviar apenas os campos que mudaram, sem sobrescrever os demais.

**Debounce na busca** — Atrasa a chamada em 400ms, evitando requests a cada tecla.

**Steam conecta via ID** — Sem OAuth. O usuario informa o Steam ID e o perfil precisa estar publico. ID salvo no localStorage.

---

## Licenca

Projeto desenvolvido para fins educacionais e de portfolio.
Dados de jogos: [RAWG Video Games Database API](https://rawg.io/apidocs).
Dados Steam: [Steam Web API](https://steamcommunity.com/dev).