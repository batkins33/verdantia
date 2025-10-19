# Verdantia

**Verdantia — Intelligent Plant Care, Naturally.**

This repo is a fully-populated scaffold for a plant identification & care app:
- **Mobile (Expo React Native)**
- **API (FastAPI)**
- **ML (stubs for training/export)**
- **Infra (Docker, GitHub Actions, docker-compose)**

## Quickstart

### 1) API
```bash
cd app/api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```
Open Swagger at: http://localhost:808:8080/docs

### 2) Mobile (Expo)
```bash
cd app/mobile
npm install
npx expo start
```
Open on device or emulator. The mock "Plant Detail" screen is wired.

### 3) Docker Compose (API + Postgres)
```bash
cd app/infra
docker compose up -d
```
API on http://localhost:8080 (first run installs deps).

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
