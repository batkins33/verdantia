# Verdantia

**Verdantia — Intelligent Plant Care, Naturally.**

A full-stack plant identification & care app with:
- **Mobile (Expo React Native + TypeScript)**
- **API (FastAPI with proper package structure)**
- **ML (stubs for training/export)**
- **Infra (Docker, GitHub Actions, docker-compose)**

## Quickstart

### Using Makefile (Recommended)
```bash
# Start API server
make api.run

# Start mobile app
make mobile.start

# Start with Docker Compose
make compose.up

# Run tests
make api.test

# View logs
make compose.logs
```

### Manual Commands

#### 1) API
```bash
cd verdantia/app/api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```
Open Swagger at: http://localhost:8080/docs

#### 2) Mobile (Expo + TypeScript)
```bash
cd verdantia/app/mobile
npm install
npx expo start
```
Open on device or emulator. Features photo upload, API integration, and offline retry.

#### 3) Docker Compose (API + Postgres)
```bash
cd verdantia/app/infra
docker compose up -d
```
API on http://localhost:8080 (first run installs deps).

## OpenAPI Refresh

To update the OpenAPI specification:

1. Start the API server: `make api.run`
2. Visit http://localhost:8080/openapi.json
3. Save the JSON to `docs/development/openapi.json`
4. Optionally generate TypeScript types from the schema

## Repo Layout
```
verdantia/
├── app/
│   ├── api/            # FastAPI service
│   ├── mobile/         # Expo RN app
│   ├── ml/             # ML stubs
│   └── infra/          # CI/CD, docker, workflows
├── docs/               # Presentations & developer docs
├── assets/             # Logos, palette, typography
├── .gitignore
├── LICENSE (MIT)
└── README.md
```

## Branching
- `main` – stable
- `dev` – active development
- `docs` – presentations & docs
- `design` – assets & UI

## Push to GitHub
```bash
git init
git add .
git commit -m "feat: verdantia scaffold"
git branch -M main
git remote add origin https://github.com/YOURUSER/verdantia.git
git push -u origin main
```

Happy building! 🌿
