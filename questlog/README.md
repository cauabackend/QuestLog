# QuestLog

Biblioteca pessoal de jogos com busca integrada via RAWG.io, gerenciamento de status e interface dark mode.

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)

---

## Sobre o projeto

QuestLog permite organizar sua colecao de jogos em um so lugar. Busque qualquer jogo pelo nome, adicione a sua biblioteca pessoal e acompanhe o que esta jogando, o que ja zerou e o que quer jogar depois.

O projeto foi construido como portfolio para demonstrar dominio do ciclo completo de uma aplicacao full-stack: backend com API REST, banco de dados relacional, consumo de API externa e frontend responsivo com interface moderna.

### Funcionalidades

- Busca de jogos com debounce integrada a API da RAWG.io (catalogo com 800k+ jogos)
- CRUD completo: adicionar, editar status/nota, remover jogos da biblioteca
- Filtros por status: jogando, zerado, na fila, largado
- Pagina de detalhes com descricao, screenshots, generos e plataformas
- Dashboard com hero do jogo atual, estatisticas e atividade recente
- Interface dark mode com glassmorphism e paleta preto/vermelho/cinza

---

## Stack

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| Backend | Python 3.13 + FastAPI | API REST com validacao automatica |
| ORM | SQLAlchemy 2.0 | Mapeamento objeto-relacional |
| Banco | SQLite | Persistencia local sem setup |
| Validacao | Pydantic v2 | Schemas de entrada e saida |
| HTTP Client | httpx | Chamadas assincronas a RAWG.io |
| Frontend | React 19 + Vite | Interface reativa com hot reload |
| Estilizacao | Tailwind CSS 4 | Utility-first CSS |
| Roteamento | React Router v6 | Navegacao SPA |

---

## Como rodar

### Pre-requisitos

- Python 3.10+
- Node.js 18+
- Conta gratuita na [RAWG.io](https://rawg.io/apidocs) para obter uma API key

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
RAWG_API_KEY=sua_key_aqui
DATABASE_URL=sqlite:///./questlog.db
```

Inicie o servidor:

```bash
uvicorn main:app --reload
```

O backend roda em `http://localhost:8000`. Acesse `http://localhost:8000/docs` para a documentacao interativa da API.

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

---

## Estrutura do projeto

```
questlog/
├── backend/
│   ├── main.py                 # Entry point FastAPI
│   ├── requirements.txt
│   └── app/
│       ├── config.py           # Variaveis de ambiente
│       ├── database.py         # Engine SQLAlchemy + SQLite
│       ├── dependencies.py     # Injecao de dependencia (get_db)
│       ├── models/game.py      # Modelo ORM da tabela games
│       ├── schemas/game.py     # Schemas Pydantic (DTOs)
│       ├── routers/games.py    # Endpoints CRUD
│       ├── routers/search.py   # Proxy RAWG.io
│       ├── services/game_service.py   # Queries do banco
│       └── services/rawg_service.py   # Cliente HTTP RAWG
│
├── frontend/
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx             # Rotas da aplicacao
│       ├── services/api.js     # Chamadas HTTP centralizadas
│       ├── hooks/useDebounce.js
│       ├── components/         # Sidebar, GameCard, StatusBadge...
│       └── pages/              # Home, Search, Library, GameDetail
│
└── README.md
```

---

## Decisoes tecnicas

**Backend como proxy da RAWG** — O frontend nunca acessa a RAWG diretamente. Todas as chamadas passam pelo backend, que esconde a API key e filtra os dados antes de retornar. Isso e uma boa pratica de seguranca.

**PATCH em vez de PUT** — O endpoint de atualizacao usa PATCH com `exclude_unset=True` do Pydantic, permitindo enviar apenas os campos que mudaram sem sobrescrever os demais.

**Debounce na busca** — O hook `useDebounce` atrasa a chamada a API em 400ms apos o usuario parar de digitar, evitando requests desnecessarias a cada tecla.

**Separacao models vs schemas** — Os models do SQLAlchemy definem a tabela no banco. Os schemas do Pydantic definem o contrato da API. Separar os dois e o padrao do mercado para projetos FastAPI.

**Campo in_library na busca** — Quando o usuario busca um jogo, o backend cruza o resultado da RAWG com o banco local e retorna um campo booleano indicando se o jogo ja esta na biblioteca.

---

## Aprendizados

- Arquitetura em camadas (routers → services → models) para separacao de responsabilidades
- Dependency injection com FastAPI (`Depends`)
- Validacao automatica de dados com Pydantic v2
- Consumo de API externa assincrona com httpx
- Gerenciamento de estado no React com hooks
- Componentizacao e reutilizacao (GameCard, StatusBadge)
- Debounce como otimizacao de performance no frontend

---

## Licenca

Este projeto foi desenvolvido para fins educacionais e de portfolio.
Dados de jogos fornecidos pela [RAWG Video Games Database API](https://rawg.io/apidocs).