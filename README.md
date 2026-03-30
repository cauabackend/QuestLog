# QuestLog

Tracker de coleção de jogos full stack. Você busca um jogo, adiciona à sua coleção e organiza por status — jogando, zerado ou na lista de espera. Os dados vêm da RAWG API, uma das maiores bases de jogos disponíveis publicamente.

🔗 [quest-log-pi.vercel.app](https://quest-log-pi.vercel.app)

---

## Funcionalidades

- Busca de jogos em tempo real via RAWG API
- Cadastro e remoção de jogos da coleção
- Filtro por status: jogando, zerado, quero jogar
- Capas carregadas diretamente do CDN da Steam

---

## O problema mais interessante

A RAWG não entrega capa de jogo diretamente. O que a API retorna é uma lista de lojas associadas ao título — Steam, Epic, GOG, entre outras — cada uma com seu próprio endpoint. Sem tratamento, o resultado é uma interface cheia de imagens quebradas.

A solução foi buscar os endpoints de cada loja em paralelo e priorizar as imagens do CDN da Steam quando disponíveis. No caminho, tratei os casos ruins: timeout silencioso, loja sem imagem cadastrada, endpoint que retorna estrutura inesperada. Quando funcionou pela primeira vez sem nenhuma imagem quebrada, deu uma satisfação desproporcional ao tamanho do problema.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React, JavaScript, HTML, CSS |
| Backend | Python, API REST |
| Banco de dados | SQLite |
| API externa | RAWG API |
| Deploy | Vercel |

---

## Estrutura

```
├── frontend/        # Interface em React
│   ├── src/
│   │   ├── components/
│   │   └── pages/
├── backend/         # API REST em Python
│   ├── main.py
│   ├── routes/
│   └── .env
└── questlog/        # Lógica principal
```

---

## Como rodar localmente

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Crie um arquivo `.env` no backend:
```
RAWG_API_KEY=sua_chave_aqui
```

Gere uma chave gratuita em [rawg.io/apidocs](https://rawg.io/apidocs).

---

## O que aprendi

Integrar uma API externa parece simples até você encontrar os casos que a documentação não menciona. A RAWG tem uma estrutura de dados inconsistente dependendo do jogo — campos que às vezes existem, às vezes não, às vezes retornam tipo diferente. Aprender a tratar isso defensivamente, sem deixar a interface quebrar, foi o aprendizado mais concreto do projeto.

Separar backend e frontend desde o início, com API REST no meio, também forçou uma disciplina de contrato entre as camadas que faz diferença quando o projeto cresce.

---

## Autor

**Cauã Pereira da Silva**
Engenharia de Software — FIAP (2º semestre)

[![GitHub](https://img.shields.io/badge/GitHub-cauabackend-181717?style=flat&logo=github)](https://github.com/cauabackend)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-cauajava-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/cauajava/)