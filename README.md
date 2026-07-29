# DefectTriageBot

An AI-powered defect triage agent for the Quality Engineering hackathon. It
turns a manual, SME-dependent 45-minute review into an explainable,
human-controlled decision in under 10 seconds.

## Phase 0 status

The project foundation is ready: a shared LangGraph state contract, deterministic
Gemini structured-output client, structured logging, safe environment template,
test bootstrap, fixture layout, and a React 18/Vite 5 dashboard starter.

## Stack

- Backend: Python 3.11, LangGraph `StateGraph`, FastAPI, uvicorn
- AI: Gemini 2.5 Flash through `langchain-google-genai`, structured output only
- Knowledge base: Gemini `gemini-embedding-001` (3072 dimensions) with local ChromaDB
- Frontend: React 18, Vite 5, Recharts
- Persistence: SQLite for feedback and analytics
- Best-effort integrations: Jira REST v3, Slack webhook, SMTP email, PagerDuty

## Project layout

```text
app/                 Python backend, graph state, nodes, API, and adapters
frontend/            React 18 + Vite 5 user interface
scripts/             Reproducible local maintenance scripts
tests/               Unit, integration, and fixture test suites
data/                Safe local development data (not generated vector storage)
docs/                Demo script and supporting documentation
```

## Local setup

1. Create a Python 3.11 virtual environment and install `requirements.txt`.
2. Copy `.env.example` to `.env` and set credentials locally. Never commit it.
3. Install and run the client from `frontend/`:

```bash
npm install
npm run dev
```

The backend API and graph nodes are implemented in subsequent phases, following
the order: state → tools → nodes → graph → API → frontend → tests.

## Core rules

- One `TriageState` flows through the whole `StateGraph`.
- Nodes return partial dictionaries only; they do not mutate shared state.
- Every node adds an audit entry to `triage_notes`.
- Nodes call external services only through `app/tools/` adapters.
- Integrations log errors and return error dictionaries instead of raising.
- Secrets are always environment variables.

## Submission documents

- [Architecture](ARCHITECTURE.md)
- [Build plan](PLAN.md)
- [Prompt log](PROMPTS.md)
- [Field mapping](FIELD_MAPPING.md)
- [Demo video script](docs/demo-video-script.md)

## Collaboration

The shared GitHub repository is `suchitdas-cognizant/defect-triage-agent`.
Each completed iteration is committed and pushed so the team can pull the same
working baseline.
